import {Command} from "./command";
import {CliOptions} from "../options/cli-options";
import {ComponentsCompiler, RaguServer, RaguServerConfig} from "ragu-server";
import {injectable} from "tsyringe";

@injectable()
export class Server implements Command {
  async run(cliOptions: CliOptions, config: RaguServerConfig): Promise<void> {
    config.compiler.watchMode = true;

    const compiler = new ComponentsCompiler(config);
    const server = new RaguServer(config, compiler);

    await compiler.compileAll();
    await server.start();
  }
}