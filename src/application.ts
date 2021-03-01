import {Command} from "./commands/command";
import {ConsoleLogger} from "ragu-server";
import {container} from "tsyringe";
import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
import {CliInput, CliOptions, CliOptionsParser} from "./options/cli-options";

export class Application {
  private consoleLogger: ConsoleLogger = new ConsoleLogger();

  async execute(command: InjectionToken<Command>, input: CliInput) {
    const cliOptionsParser = container.resolve(CliOptionsParser);

    try {
      const options = cliOptionsParser.parseInput(input);
      this.registerLogger(options);
      await container.resolve(command).run(options);
    } catch (e) {
      this.processException(e, input);
    }
  }

  private registerLogger(options: CliOptions) {
    this.consoleLogger = new ConsoleLogger(options.logLevel);
    container.registerInstance(ConsoleLogger, this.consoleLogger);
  }

  private processException(e: any, input: CliInput) {
    const message = e.message || e;
    this.consoleLogger.error(message);

    if (input.log === 'debug') {
      console.log(e);
    }
  }
}
