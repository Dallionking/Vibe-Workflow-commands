const yaml = require('js-yaml');
const fs = require('fs').promises;
const path = require('path');

class WorkflowBuilder {
    constructor() {
        this.workflow = {
            name: '',
            description: '',
            version: '1.0.0',
            steps: []
        };
    }

    name(name) {
        this.workflow.name = name;
        return this;
    }

    description(desc) {
        this.workflow.description = desc;
        return this;
    }

    version(ver) {
        this.workflow.version = ver;
        return this;
    }

    agent(agentName, params = {}) {
        this.workflow.steps.push({
            type: 'agent',
            agent: agentName,
            params
        });
        return this;
    }

    parallel(...agents) {
        const agentList = agents.map(a => {
            if (typeof a === 'string') {
                return a;
            }
            return a.agent;
        });

        this.workflow.steps.push({
            type: 'parallel',
            agents: agentList,
            params: {}
        });
        return this;
    }

    sequential(...agents) {
        const agentList = agents.map(a => {
            if (typeof a === 'string') {
                return a;
            }
            return a.agent;
        });

        this.workflow.steps.push({
            type: 'sequential',
            agents: agentList,
            params: {}
        });
        return this;
    }

    conditional(condition, thenBuilder, elseBuilder) {
        const thenSteps = [];
        const elseSteps = [];

        if (thenBuilder) {
            const thenWorkflow = new WorkflowBuilder();
            thenBuilder(thenWorkflow);
            thenSteps.push(...thenWorkflow.workflow.steps);
        }

        if (elseBuilder) {
            const elseWorkflow = new WorkflowBuilder();
            elseBuilder(elseWorkflow);
            elseSteps.push(...elseWorkflow.workflow.steps);
        }

        this.workflow.steps.push({
            type: 'conditional',
            condition,
            then: thenSteps,
            else: elseSteps
        });
        return this;
    }

    loop(condition, builder) {
        const loopWorkflow = new WorkflowBuilder();
        builder(loopWorkflow);

        this.workflow.steps.push({
            type: 'loop',
            condition,
            steps: loopWorkflow.workflow.steps
        });
        return this;
    }

    approval(message, options = {}) {
        this.workflow.steps.push({
            type: 'user-approval',
            message,
            ...options
        });
        return this;
    }

    withParams(params) {
        if (this.workflow.steps.length > 0) {
            const lastStep = this.workflow.steps[this.workflow.steps.length - 1];
            lastStep.params = { ...lastStep.params, ...params };
        }
        return this;
    }

    continueOnError() {
        if (this.workflow.steps.length > 0) {
            const lastStep = this.workflow.steps[this.workflow.steps.length - 1];
            lastStep.continueOnError = true;
        }
        return this;
    }

    timeout(ms) {
        if (this.workflow.steps.length > 0) {
            const lastStep = this.workflow.steps[this.workflow.steps.length - 1];
            lastStep.timeout = ms;
        }
        return this;
    }

    build() {
        return { ...this.workflow };
    }

    toYaml() {
        return yaml.dump(this.workflow, { indent: 2 });
    }

    async save(filepath) {
        const content = this.toYaml();
        await fs.writeFile(filepath, content);
        return filepath;
    }

    static async load(filepath) {
        const content = await fs.readFile(filepath, 'utf8');
        const workflow = yaml.load(content);
        
        const builder = new WorkflowBuilder();
        builder.workflow = workflow;
        return builder;
    }

    static create() {
        return new WorkflowBuilder();
    }
}

// Condition helper functions
WorkflowBuilder.conditions = {
    fieldEquals: (field, value) => ({
        type: 'field',
        field,
        operator: 'equals',
        value
    }),

    fieldExists: (field) => ({
        type: 'field',
        field,
        operator: 'exists'
    }),

    fieldContains: (field, value) => ({
        type: 'field',
        field,
        operator: 'contains',
        value
    }),

    script: (expression) => ({
        type: 'script',
        expression
    }),

    and: (...conditions) => ({
        type: 'script',
        expression: conditions.map((c, i) => `(${JSON.stringify(c)})`).join(' && ')
    }),

    or: (...conditions) => ({
        type: 'script',
        expression: conditions.map((c, i) => `(${JSON.stringify(c)})`).join(' || ')
    }),

    not: (condition) => ({
        type: 'script',
        expression: `!(${JSON.stringify(condition)})`
    })
};

module.exports = WorkflowBuilder;