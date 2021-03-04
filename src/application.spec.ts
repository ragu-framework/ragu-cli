import {Command} from "./commands/command";
import {Application} from "./application";
import {container} from "tsyringe";
import {ConsoleLogger, LogLevel} from "ragu-server";
import {CliOptions, NoComponentResolveSpecifiedError} from "./options/cli-options";
import {AdapterDetector} from "./adapters/adapter-detector";
import {AvailableAdapters} from "./adapters/available-adapters";

describe('Application', () => {
  class StubCommand implements Command {
    constructor(private readonly command?: (config: CliOptions) => Promise<void> | void) {
    }

    async run(cliOptions: CliOptions) {
      if (this.command) {
        await this.command(cliOptions);
      }
    }
  }

  beforeEach(() => {
    container.registerInstance(AdapterDetector, {
      detectAdaptor(): AvailableAdapters | null {
        return AvailableAdapters.react
      }
    } as AdapterDetector);
  });

  describe('logger', () => {
    beforeEach(() => {
      // Console logger is defined at the test setup.
      container.clearInstances();
      container.registerInstance(AdapterDetector, {
        detectAdaptor(): AvailableAdapters | null {
          return AvailableAdapters.react
        }
      } as AdapterDetector);
      container.registerInstance(StubCommand, new StubCommand());
    });

    it('registers a logger', async () => {
      await Application.init({file: 'my-file.js'}).execute(StubCommand);
      expect(() => container.resolve(ConsoleLogger)).not.toThrow();
    })

    it('registers a logger with the defined level', async () => {
      await Application.init({file: 'my-file.js', log: 'error'}).execute(StubCommand);
      expect(container.resolve(ConsoleLogger).minLevel).toEqual(LogLevel.error);
    });
  });

  describe('detecting the framework', () => {
    it('uses the given adapter', async () => {
      const stub = jest.fn();

      container.registerInstance(StubCommand, new StubCommand((options) => {
        return stub(options);
      }));

      container.registerInstance(AdapterDetector, {
        detectAdaptor(): AvailableAdapters | null {
          return AvailableAdapters.vue
        }
      } as AdapterDetector);

      await Application.init({file: 'my-file.js', log: 'error', adapter: 'react'}).execute(StubCommand);

      expect(stub).toBeCalledWith(expect.objectContaining({
        adapter: AvailableAdapters.react
      }));
    });

    it('runs the command with the detected adapter', async () => {
      const stub = jest.fn();

      container.registerInstance(StubCommand, new StubCommand((options) => {
        return stub(options);
      }));

      container.registerInstance(AdapterDetector, {
        detectAdaptor(): AvailableAdapters | null {
          return AvailableAdapters.vue
        }
      } as AdapterDetector);

      await Application.init({file: 'my-file.js', log: 'error'}).execute(StubCommand);

      expect(stub).toBeCalledWith(expect.objectContaining({
        adapter: AvailableAdapters.vue
      }));
    });
  });

  describe('executing the command', () => {
    it('executes the given command', async () => {
      const stub = jest.fn();
      container.registerInstance(StubCommand, new StubCommand(() => stub()));

      await Application.init({file: 'my-file.js'}).execute(StubCommand);
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
          await Application.init({file: 'my-file.js'}).execute(StubCommand, );
        } catch {}

        expect(logger.error).toBeCalledWith('Oh Dear!');
      });

      it('logs initialization error', async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});

        expect(await Application.init({}).execute).not.toBeUndefined();
        expect(console.error).toBeCalled();
      });

      it('logs initialization error and stacktrace given debug mode', async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(console, "log").mockImplementation(() => {});

        expect(await Application.init({log: 'debug'}).execute).not.toBeUndefined();
        expect(console.log).toBeCalledWith(new NoComponentResolveSpecifiedError());
      });

      it('logs an error given an non Error is thrown', async () => {
        let logger!: ConsoleLogger;

        container.registerInstance(StubCommand, new StubCommand(() => {
          logger = container.resolve(ConsoleLogger);
          logger.error = jest.fn();
          throw 'Oh Dear!';
        }));

        try {
          await Application.init({file: 'my-file.js'}).execute(StubCommand);
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
          await Application.init({file: 'my-file.js', log: 'debug'}).execute(StubCommand);
        } catch {}

        expect(console.log).toBeCalledWith(error);
      });
    });
  });
});
