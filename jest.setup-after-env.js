require('reflect-metadata');
const {container} = require("tsyringe");
const {ConsoleLogger} = require("ragu-server");

afterEach(() => {
  container.clearInstances();
})

beforeEach(() => {
  const consoleLogger = new ConsoleLogger();

  consoleLogger.info = jest.fn();
  consoleLogger.error = jest.fn();
  consoleLogger.debug = jest.fn();
  consoleLogger.warn = jest.fn();

  container.registerInstance(ConsoleLogger, consoleLogger);
});
