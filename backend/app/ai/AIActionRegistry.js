const logger = require('../core/logger/logger');

class AIActionRegistry {
  constructor() {
    this.actions = new Map();
    this.registerCoreActions();
  }

  registerAction(actionName, description, schema, handler) {
    this.actions.set(actionName, {
      name: actionName,
      description,
      schema,
      handler
    });
  }

  registerCoreActions() {
    // Action 1: Navigate to Learning Module
    this.registerAction(
      'openLearningModule',
      'Navigate user to a specific learning module/chapter',
      { subjectId: 'string', chapterId: 'string', lessonId: 'string' },
      async (params, context) => ({
        type: 'NAVIGATE',
        route: `/learn/${params.subjectId || 'cs-101'}/${params.chapterId || 'ch-1'}/${params.lessonId || 'les-1'}`,
        message: `Navigating to lesson: ${params.lessonId || 'les-1'}`
      })
    );

    // Action 2: Start Practice Session
    this.registerAction(
      'startPractice',
      'Launch an adaptive practice quiz session for a subject',
      { subjectId: 'string', setId: 'string' },
      async (params, context) => ({
        type: 'NAVIGATE',
        route: `/practice/${params.subjectId || 'cs-101'}/${params.setId || 'set-1'}`,
        message: `Starting practice set for ${params.subjectId || 'cs-101'}`
      })
    );

    // Action 3: Schedule Mock Interview
    this.registerAction(
      'scheduleInterview',
      'Configure and open AI Interview Studio for mock technical interview',
      { role: 'string', company: 'string', difficulty: 'string' },
      async (params, context) => ({
        type: 'NAVIGATE',
        route: `/interview/mock-101/setup`,
        params: { role: params.role || 'Full Stack', company: params.company || 'Google' },
        message: `Setting up mock interview for ${params.role || 'Full Stack'} at ${params.company || 'Google'}`
      })
    );

    // Action 4: Open CodeLab Algorithmic Problem
    this.registerAction(
      'openCodeLabProblem',
      'Open a specific coding challenge in CodeLab IDE',
      { problemId: 'string' },
      async (params, context) => ({
        type: 'NAVIGATE',
        route: `/codelab/${params.problemId || 'reverse-string'}`,
        message: `Opening CodeLab challenge: ${params.problemId || 'reverse-string'}`
      })
    );

    // Action 5: Update User Goal
    this.registerAction(
      'updateUserGoal',
      'Update target career role or target company goal in AI memory',
      { currentGoal: 'string', targetCompany: 'string' },
      async (params, context) => ({
        type: 'MEMORY_UPDATE',
        updates: { currentGoal: params.currentGoal, targetCompany: params.targetCompany },
        message: `Updated target goal to ${params.currentGoal || 'Software Engineer'} at ${params.targetCompany || 'Tier 1'}`
      })
    );
  }

  async executeAction(actionName, params = {}, context = {}) {
    const action = this.actions.get(actionName);
    if (!action) {
      throw new Error(`Unregistered AI Action: ${actionName}`);
    }

    logger.info(`[AI ACTION EXECUTOR] Running action: ${actionName}`, { params });
    return await action.handler(params, context);
  }

  async executeChain(actionChain = [], context = {}) {
    const results = [];
    for (const step of actionChain) {
      const res = await this.executeAction(step.action, step.params || {}, context);
      results.push({ action: step.action, result: res });
    }
    return results;
  }

  getAvailableActions() {
    return Array.from(this.actions.values()).map(a => ({
      name: a.name,
      description: a.description,
      schema: a.schema
    }));
  }
}

module.exports = new AIActionRegistry();
