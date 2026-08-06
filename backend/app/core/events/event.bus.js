const EventEmitter = require('events');
const logger = require('../logger/logger');

/**
 * Enterprise Event Bus Foundation
 * Provides async event publishing, subscription, and domain event dispatching.
 */
class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  /**
   * Publish an event asynchronously with context logging
   */
  publish(eventName, payload = {}) {
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      payload
    };

    logger.debug(`[EventBus] Publishing event: ${eventName}`, eventData);

    // Dispatch via Node EventEmitter
    process.nextTick(() => {
      this.emit(eventName, eventData);
    });
  }

  /**
   * Subscribe to a domain event with automatic error containment
   */
  subscribe(eventName, handler) {
    const safeHandler = async (eventData) => {
      try {
        await handler(eventData.payload, eventData);
      } catch (err) {
        logger.error(`[EventBus] Error executing subscriber for event: ${eventName}`, {
          error: err.message,
          stack: err.stack,
          eventData
        });
      }
    };

    this.on(eventName, safeHandler);
    return () => this.removeListener(eventName, safeHandler);
  }
}

const eventBusInstance = new EventBus();

// Standard Domain Events Registry
const DOMAIN_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  ASSESSMENT_COMPLETED: 'assessment.completed',
  PROCTOR_ALERT_TRIGGERED: 'proctor.alert_triggered',
  CODE_SUBMITTED: 'code.submitted',
  FEATURE_FLAG_UPDATED: 'feature_flag.updated'
};

module.exports = {
  eventBus: eventBusInstance,
  EventBus,
  DOMAIN_EVENTS
};
