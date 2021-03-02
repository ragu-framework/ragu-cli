import {Command} from "./command";
import {CliOptions} from "../options/cli-options";
import {RaguServerConfig} from "ragu-server";
import {injectable} from "tsyringe";
import {Build} from "./build";

@injectable()
export class BuildStatic implements Command {
  constructor(private readonly build: Build) {
  }

  async run(cliOptions: CliOptions, config: RaguServerConfig): Promise<void> {
    config.static = true;

    await this.build.run(cliOptions, config);
  }
}
