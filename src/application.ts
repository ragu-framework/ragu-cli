import {Command} from "./commands/command";
import {ConsoleLogger, LogLevel} from "ragu-server";
import {container, inject, injectable} from "tsyringe";
import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
import {CliInput, CliOptions, CliOptionsParser} from "./options/cli-options";
import {AdapterDetector} from "./adapters/adapter-detector";
import {AvailableAdapters} from "./adapters/available-adapters";

const protectedApplicationOptions = Symbol();

@injectable()
export class Application {
  constructor(
      @inject(protectedApplicationOptions) private options: CliOptions,
      private consoleLogger: ConsoleLogger,
      private adapterDetector: AdapterDetector
  ) {
  }

  async execute(command: InjectionToken<Command>) {
    try {
      await container.resolve(command).run(this.getOptions());
    } catch (e) {
      this.processException(e);
    }
  }

  private getOptions() {
    const options = this.options;

    if (!options.adapter || options.adapter !== AvailableAdapters.custom) {
      return {
        ...options,
        adapter: this.adapterDetector.detectAdaptor()
      }
    }

    return options;
  }

  private processException(e: any) {
    const message = e.message || e;
    this.consoleLogger.error(message);

    if (this.options.logLevel === LogLevel.debug) {
      console.log(e);
    }
  }

  static init(input: CliInput) {
    const cliOptionsParser = container.resolve(CliOptionsParser);

    try {
      const options = cliOptionsParser.parseInput(input);
      container.registerInstance(protectedApplicationOptions, options);
      container.registerInstance(ConsoleLogger, new ConsoleLogger(options.logLevel));

      return container.resolve(Application);
    } catch (e) {
      const message = e.message || e;
      new ConsoleLogger().error(message);

      if (input.log === 'debug') {
        console.log(e);
      }

      return { execute() {} }
    }
  }
}
