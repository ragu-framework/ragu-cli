import {Command} from "./command";
import {CliOptions} from "../options/cli-options";
import {ComponentsCompiler, RaguServerConfig} from "ragu-server";
import {injectable} from "tsyringe";

@injectable()
export class Build implements Command {
  async run(cliOptions: CliOptions, config: RaguServerConfig, production = false): Promise<void> {
    if (production) {
      config.environment = 'production';
    }

    const compiler = new ComponentsCompiler(config);
    await compiler.compileAll();
  }
}
