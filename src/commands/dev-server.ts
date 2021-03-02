import {Command} from "./command";
import {CliOptions} from "../options/cli-options";
import {RaguServerConfig} from "ragu-server";
import {injectable} from "tsyringe";
import {Server} from "./server";

@injectable()
export class DevServer implements Command {
  constructor(private readonly server: Server) {
  }

  async run(cliOptions: CliOptions, config: RaguServerConfig): Promise<void> {
    config.compiler.watchMode = true;

    await this.server.run(cliOptions, config);
  }
}
