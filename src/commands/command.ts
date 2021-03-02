import {CliOptions} from "../options/cli-options";
import {RaguServerConfig} from "ragu-server";

export interface Command {
  run(cliOptions: CliOptions, config: RaguServerConfig): Promise<void>
}
