import winston from 'winston';
import chalk from 'chalk';
const { combine, timestamp, printf, colorize, json } = winston.format;
// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, service, ...meta }) => {
    const coloredLevel = chalk.bold(level.toUpperCase());
    const coloredService = service ? chalk.cyan(`[${service}]`) : '';
    const coloredTimestamp = chalk.gray(timestamp);
    let formattedMessage = `${coloredTimestamp} ${coloredLevel} ${coloredService} ${message}`;
    if (Object.keys(meta).length > 0) {
        formattedMessage += '\n' + chalk.gray(JSON.stringify(meta, null, 2));
    }
    return formattedMessage;
});
// Create logger instance
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), json()),
    transports: [
        new winston.transports.Console({
            format: combine(colorize(), consoleFormat)
        })
    ]
});
// Add file transport if LOG_FILE is specified
if (process.env.LOG_FILE) {
    logger.add(new winston.transports.File({
        filename: process.env.LOG_FILE,
        format: combine(timestamp(), json())
    }));
}
// Service-specific logger factory
export function createServiceLogger(service) {
    return logger.child({ service });
}
// Structured logging helpers
export const log = {
    info: (message, meta) => logger.info(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    error: (message, meta) => logger.error(message, meta),
    debug: (message, meta) => logger.debug(message, meta),
    // Agent-specific logging
    agent: {
        spawned: (agentId, role, branch) => logger.info(`Agent spawned`, { agentId, role, branch, event: 'agent.spawned' }),
        taskClaimed: (agentId, taskId) => logger.info(`Task claimed`, { agentId, taskId, event: 'task.claimed' }),
        taskCompleted: (agentId, taskId, duration) => logger.info(`Task completed`, { agentId, taskId, duration, event: 'task.completed' }),
        error: (agentId, error, context) => logger.error(`Agent error`, { agentId, error: error.message, stack: error.stack, context })
    },
    // System-specific logging
    system: {
        ready: (port) => logger.info(`Orchestrator ready on port ${port}`, { event: 'system.ready' }),
        shutdown: () => logger.info('System shutdown initiated', { event: 'system.shutdown' }),
        error: (error, context) => logger.error('System error', { error: error.message, stack: error.stack, context })
    },
    // Git-specific logging
    git: {
        worktreeCreated: (path, branch, agentId) => logger.info(`Worktree created`, { path, branch, agentId, event: 'git.worktree.created' }),
        mergeStarted: (sourceBranch, targetBranch) => logger.info(`Merge started`, { sourceBranch, targetBranch, event: 'git.merge.started' }),
        mergeCompleted: (sourceBranch, targetBranch, mergeCommit) => logger.info(`Merge completed`, { sourceBranch, targetBranch, mergeCommit, event: 'git.merge.completed' }),
        conflict: (file, type, details) => logger.warn(`Merge conflict`, { file, type, details, event: 'git.merge.conflict' })
    }
};
export default logger;
//# sourceMappingURL=logger.js.map