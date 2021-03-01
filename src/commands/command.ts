import {CliOptions} from "../options/cli-options";

export interface Command {
  run(cliOptions: CliOptions): Promise<void>
}
