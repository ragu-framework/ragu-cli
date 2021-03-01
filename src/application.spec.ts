import {Command} from "./commands/command";
import {Application} from "./application";
import {container} from "tsyringe";
import {ConsoleLogger, LogLevel} from "ragu-server";
import {CliOptions} from "./options/cli-options";

describe('Application', () => {
  class StubCommand implements Command {
    constructor(private readonly command?: () => Promise<void> | void) {
    }

    async run(cliOptions: CliOptions) {
      if (this.command) {
        await this.command();
      }
    }
  }

  describe('logger', () => {
    beforeEach(() => {
      // Console logger is defined at the test setup.
      container.clearInstances();
      container.registerInstance(StubCommand, new StubCommand());
    });

    it('registers a logger', async () => {
      await new Application().execute(StubCommand, {file: 'my-file.js'});
      expect(() => container.resolve(ConsoleLogger)).not.toThrow();
    })

    it('registers a logger with the defined level', async () => {
      await new Application().execute(StubCommand, {file: 'my-file.js', log: 'error'});
      expect(container.resolve(ConsoleLogger).minLevel).toEqual(LogLevel.error);
    });
  });

  describe('executing the command', () => {
    it('executes the given command', async () => {
      const stub = jest.fn();
      container.registerInstance(StubCommand, new StubCommand(() => stub()));

      await new Application().execute(StubCommand, {file: 'my-file.js'});
      expect(stub).toBeCalled();
    });

    describe('logging errors', () => {
      it('logs an error given an exception is thrown', async () => {
        let logger!: ConsoleLogger;

        container.registerInstance(StubCommand, new StubCommand(() => {
          logger = container.resolve(ConsoleLogger);
          logger.error = jest.fn();
          throw new Error('Oh Dear!')
        }));

        try {
          await new Application().execute(StubCommand, {file: 'my-file.js'});
        } catch {}

        expect(logger.error).toBeCalledWith('Oh Dear!');
      });

      it('logs an error given an non Error is thrown', async () => {
        let logger!: ConsoleLogger;

        container.registerInstance(StubCommand, new StubCommand(() => {
          logger = container.resolve(ConsoleLogger);
          logger.error = jest.fn();
          throw 'Oh Dear!';
        }));

        try {
          await new Application().execute(StubCommand, {file: 'my-file.js'});
        } catch {}

        expect(logger.error).toBeCalledWith('Oh Dear!');
      });

      it('logs the stacktrace given a debug log level', async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        const error = new Error('Oh Dear!');

        container.registerInstance(StubCommand, new StubCommand(() => {
          container.resolve(ConsoleLogger).error = jest.fn();
          throw error;
        }));

        try {
          await new Application().execute(StubCommand, {file: 'my-file.js', log: 'debug'});
        } catch {}

        expect(console.log).toBeCalledWith(error);
      });
    });
  });
});
