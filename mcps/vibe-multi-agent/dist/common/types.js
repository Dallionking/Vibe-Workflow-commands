export var EventType;
(function (EventType) {
    // Task Management
    EventType["TASK_CREATED"] = "task.created";
    EventType["TASK_CLAIMED"] = "task.claimed";
    EventType["TASK_STARTED"] = "task.started";
    EventType["TASK_COMPLETED"] = "task.completed";
    EventType["TASK_FAILED"] = "task.failed";
    // Agent Lifecycle
    EventType["AGENT_SPAWNED"] = "agent.spawned";
    EventType["AGENT_READY"] = "agent.ready";
    EventType["AGENT_BUSY"] = "agent.busy";
    EventType["AGENT_IDLE"] = "agent.idle";
    EventType["AGENT_TERMINATED"] = "agent.terminated";
    // Synchronization
    EventType["SYNC_REQUESTED"] = "sync.requested";
    EventType["SYNC_STARTED"] = "sync.started";
    EventType["SYNC_COMPLETED"] = "sync.completed";
    EventType["MERGE_CONFLICT"] = "merge.conflict";
    // System
    EventType["SYSTEM_READY"] = "system.ready";
    EventType["SYSTEM_SHUTDOWN"] = "system.shutdown";
    EventType["ERROR"] = "error";
})(EventType || (EventType = {}));
//# sourceMappingURL=types.js.map