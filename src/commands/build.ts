import {Command} from "./command";
import {CliOptions} from "../options/cli-options";
import {ComponentsCompiler, RaguServerConfig} from "ragu-server";
import {injectable} from "tsyringe";

@injectable()
export class Build implements Command {
  async run(cliOptions: CliOptions, config: RaguServerConfig): Promise<void> {
    const compiler = new ComponentsCompiler(config);
    await compiler.compileAll();
  }
}
