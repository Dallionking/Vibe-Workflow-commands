"""
Claude + LangGraph Multi-Agent Kanban System Implementation Example

This file demonstrates how to implement a multi-agent system using LangGraph
with Claude (Anthropic) as the LLM, featuring kanban-style task management.
"""

from typing import Annotated, List, Dict, Literal
from enum import Enum
from dataclasses import dataclass
from langchain_core.tools import tool, InjectedToolCallId
from langchain_anthropic import ChatAnthropic
from langgraph.prebuilt import create_react_agent, InjectedState
from langgraph.graph import StateGraph, START, MessagesState
from langgraph.types import Command
from langgraph.checkpoint.memory import MemorySaver

# ============================================================================
# Kanban Task Management System
# ============================================================================

class TaskState(Enum):
    TODO = "todo"
    IN_PROGRESS = "in-progress"
    DONE = "done"

@dataclass
class Task:
    id: str
    title: str
    description: str
    state: TaskState
    assigned_agent: str = None
    priority: str = "medium"
    dependencies: List[str] = None
    
    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []

class KanbanState(MessagesState):
    """Extended state that includes kanban board management"""
    tasks: List[Task]
    current_agent: str
    board_stats: Dict[str, int]

# ============================================================================
# Agent Handoff System
# ============================================================================

def create_handoff_tool(*, agent_name: str, description: str | None = None):
    """Create a handoff tool for transferring control between agents"""
    name = f"transfer_to_{agent_name}"
    description = description or f"Transfer control to {agent_name}"

    @tool(name, description=description)
    def handoff_tool(
        state: Annotated[KanbanState, InjectedState],
        tool_call_id: Annotated[str, InjectedToolCallId],
    ) -> Command:
        tool_message = {
            "role": "tool",
            "content": f"Successfully transferred to {agent_name}",
            "name": name,
            "tool_call_id": tool_call_id,
        }
        
        # Update current agent in state
        updated_state = {
            **state,
            "current_agent": agent_name,
            "messages": state["messages"] + [tool_message]
        }
        
        return Command(
            goto=agent_name,
            update=updated_state,
            graph=Command.PARENT,
        )
    return handoff_tool

# ============================================================================
# Task Management Tools
# ============================================================================

@tool
def create_task(
    title: str,
    description: str,
    priority: str = "medium",
    state: Annotated[KanbanState, InjectedState] = None
) -> str:
    """Create a new task and add it to the kanban board"""
    import uuid
    
    task_id = str(uuid.uuid4())[:8]
    new_task = Task(
        id=task_id,
        title=title,
        description=description,
        state=TaskState.TODO,
        priority=priority
    )
    
    # Add task to board
    updated_tasks = state["tasks"] + [new_task]
    
    return f"Created task '{title}' with ID {task_id}"

@tool
def claim_task(
    task_id: str,
    state: Annotated[KanbanState, InjectedState] = None
) -> str:
    """Claim a task from TODO and move it to IN_PROGRESS"""
    tasks = state["tasks"]
    current_agent = state["current_agent"]
    
    for task in tasks:
        if task.id == task_id:
            if task.state == TaskState.TODO:
                task.state = TaskState.IN_PROGRESS
                task.assigned_agent = current_agent
                return f"Task '{task.title}' claimed and moved to IN_PROGRESS"
            else:
                return f"Task '{task.title}' is already {task.state.value}"
    
    return f"Task with ID {task_id} not found"

@tool
def complete_task(
    task_id: str,
    state: Annotated[KanbanState, InjectedState] = None
) -> str:
    """Mark a task as completed"""
    tasks = state["tasks"]
    current_agent = state["current_agent"]
    
    for task in tasks:
        if task.id == task_id:
            if task.assigned_agent == current_agent:
                task.state = TaskState.DONE
                return f"Task '{task.title}' completed!"
            else:
                return f"Task '{task.title}' is assigned to {task.assigned_agent}, not {current_agent}"
    
    return f"Task with ID {task_id} not found"

@tool
def get_board_status(
    state: Annotated[KanbanState, InjectedState] = None
) -> str:
    """Get current kanban board status"""
    tasks = state["tasks"]
    
    todo_count = sum(1 for task in tasks if task.state == TaskState.TODO)
    in_progress_count = sum(1 for task in tasks if task.state == TaskState.IN_PROGRESS)
    done_count = sum(1 for task in tasks if task.state == TaskState.DONE)
    
    status = f"""
    Kanban Board Status:
    📋 TODO: {todo_count} tasks
    🔄 IN_PROGRESS: {in_progress_count} tasks
    ✅ DONE: {done_count} tasks
    
    Current Agent: {state["current_agent"]}
    """
    
    # List tasks by status
    for status_type in [TaskState.TODO, TaskState.IN_PROGRESS, TaskState.DONE]:
        filtered_tasks = [task for task in tasks if task.state == status_type]
        if filtered_tasks:
            status += f"\n{status_type.value.upper()} Tasks:\n"
            for task in filtered_tasks:
                agent_info = f" (assigned to {task.assigned_agent})" if task.assigned_agent else ""
                status += f"  - {task.id}: {task.title}{agent_info}\n"
    
    return status

# ============================================================================
# Agent Definitions
# ============================================================================

# Initialize Claude model
claude_model = ChatAnthropic(
    model="claude-3-5-sonnet-20241022",
    temperature=0.1,
    max_tokens=1000
)

# Create handoff tools
transfer_to_research_agent = create_handoff_tool(
    agent_name="research_agent",
    description="Transfer to research agent for information gathering and analysis"
)

transfer_to_coding_agent = create_handoff_tool(
    agent_name="coding_agent", 
    description="Transfer to coding agent for implementation tasks"
)

transfer_to_qa_agent = create_handoff_tool(
    agent_name="qa_agent",
    description="Transfer to QA agent for testing and validation"
)

transfer_to_orchestrator = create_handoff_tool(
    agent_name="orchestrator",
    description="Transfer back to orchestrator for task coordination"
)

# Define specialized agents
research_agent = create_react_agent(
    model=claude_model,
    tools=[
        create_task,
        claim_task,
        complete_task,
        get_board_status,
        transfer_to_coding_agent,
        transfer_to_qa_agent,
        transfer_to_orchestrator
    ],
    prompt="""You are a Research Agent specialized in information gathering and analysis.
    
    Your responsibilities:
    - Gather information and conduct research
    - Analyze requirements and create research tasks
    - Break down complex problems into manageable pieces
    - Provide insights and recommendations
    
    Kanban Workflow:
    - Claim research tasks from TODO
    - Move tasks to IN_PROGRESS when working on them
    - Complete tasks when research is finished
    - Create new tasks if you discover additional research needs
    
    Transfer to other agents when:
    - Implementation is needed → coding_agent
    - Testing is required → qa_agent
    - Coordination is needed → orchestrator
    """,
    name="research_agent"
)

coding_agent = create_react_agent(
    model=claude_model,
    tools=[
        create_task,
        claim_task,
        complete_task,
        get_board_status,
        transfer_to_research_agent,
        transfer_to_qa_agent,
        transfer_to_orchestrator
    ],
    prompt="""You are a Coding Agent specialized in implementation and development.
    
    Your responsibilities:
    - Implement features and functionality
    - Write clean, efficient code
    - Create coding-related tasks
    - Debug and fix issues
    
    Kanban Workflow:
    - Claim coding tasks from TODO
    - Move tasks to IN_PROGRESS when coding
    - Complete tasks when implementation is finished
    - Create new tasks for additional coding needs
    
    Transfer to other agents when:
    - Research is needed → research_agent
    - Testing is required → qa_agent
    - Coordination is needed → orchestrator
    """,
    name="coding_agent"
)

qa_agent = create_react_agent(
    model=claude_model,
    tools=[
        create_task,
        claim_task,
        complete_task,
        get_board_status,
        transfer_to_research_agent,
        transfer_to_coding_agent,
        transfer_to_orchestrator
    ],
    prompt="""You are a QA Agent specialized in testing and validation.
    
    Your responsibilities:
    - Test implementations and features
    - Validate requirements are met
    - Create testing tasks
    - Ensure quality standards
    
    Kanban Workflow:
    - Claim testing tasks from TODO
    - Move tasks to IN_PROGRESS when testing
    - Complete tasks when validation is finished
    - Create new tasks for additional testing needs
    
    Transfer to other agents when:
    - Research is needed → research_agent
    - Fixes are required → coding_agent
    - Coordination is needed → orchestrator
    """,
    name="qa_agent"
)

orchestrator = create_react_agent(
    model=claude_model,
    tools=[
        create_task,
        claim_task,
        complete_task,
        get_board_status,
        transfer_to_research_agent,
        transfer_to_coding_agent,
        transfer_to_qa_agent
    ],
    prompt="""You are the Orchestrator Agent responsible for coordinating the multi-agent system.
    
    Your responsibilities:
    - Coordinate between all agents
    - Manage overall project flow
    - Create high-level tasks and break them down
    - Monitor kanban board progress
    - Make decisions about task prioritization
    
    Kanban Workflow:
    - Monitor the overall board status
    - Create tasks for the team
    - Coordinate handoffs between agents
    - Ensure work flows smoothly
    
    Transfer to specialized agents when:
    - Research is needed → research_agent
    - Implementation is required → coding_agent
    - Testing is needed → qa_agent
    
    Always start by checking the board status to understand current state.
    """,
    name="orchestrator"
)

# ============================================================================
# Multi-Agent Graph Construction
# ============================================================================

def initialize_kanban_state(state: KanbanState) -> KanbanState:
    """Initialize the kanban board state if not present"""
    if "tasks" not in state:
        state["tasks"] = []
    if "current_agent" not in state:
        state["current_agent"] = "orchestrator"
    if "board_stats" not in state:
        state["board_stats"] = {"todo": 0, "in_progress": 0, "done": 0}
    return state

# Create the multi-agent graph
multi_agent_graph = (
    StateGraph(KanbanState)
    .add_node("orchestrator", orchestrator)
    .add_node("research_agent", research_agent)
    .add_node("coding_agent", coding_agent)
    .add_node("qa_agent", qa_agent)
    .add_edge(START, "orchestrator")
    .compile(checkpointer=MemorySaver())
)

# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    # Example configuration for stateful execution
    config = {
        "configurable": {
            "thread_id": "multi_agent_session_1"
        }
    }
    
    # Initialize with sample tasks
    initial_state = {
        "messages": [{
            "role": "user", 
            "content": "I need to build a user authentication system. Can you help coordinate this across the team?"
        }],
        "tasks": [
            Task(
                id="auth-001",
                title="Research authentication best practices",
                description="Research OAuth 2.0, JWT, and session management",
                state=TaskState.TODO
            ),
            Task(
                id="auth-002", 
                title="Implement authentication API",
                description="Build REST API endpoints for auth",
                state=TaskState.TODO
            ),
            Task(
                id="auth-003",
                title="Test authentication flow",
                description="Create comprehensive test suite",
                state=TaskState.TODO
            )
        ],
        "current_agent": "orchestrator",
        "board_stats": {"todo": 3, "in_progress": 0, "done": 0}
    }
    
    # Run the multi-agent system
    print("=== Multi-Agent Kanban System Demo ===\n")
    
    try:
        for chunk in multi_agent_graph.stream(initial_state, config=config):
            print(f"Update: {chunk}")
            print("-" * 50)
            
    except Exception as e:
        print(f"Error: {e}")
        
    print("\n=== Demo Complete ===")