import {AdapterConfigFactory} from "../adapter-config-factory";
import {ConsoleLogger, mergeConfig, RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {injectable} from "tsyringe";
import {DetectInstallation} from "../../adapters/detect-installation";

export class InvalidCustomConfigOverride extends Error {
  constructor(field: string) {
    super(`You can't override "${field}" when using a custom adapter. Instead change your config file.`);
  }
}

export class ConfigFileNotFound extends Error {
  constructor(filename: string) {
    super(`Could not open the config file: ${filename}`);
  }
}

export class CustomConfigFactory implements AdapterConfigFactory {
  constructor(
      private readonly configFile: string,
      private readonly consoleLogger: ConsoleLogger,
      private readonly detectInstallation: DetectInstallation
  ) {
  }

  createDirectoryConfig(overrides: RaguServerBaseConfigProps): RaguServerConfig {
    if (overrides?.compiler?.output?.directory) {
      throw new InvalidCustomConfigOverride('output');
    }

    if (!this.detectInstallation.isPackageAvailable(this.configFile)) {
      throw new ConfigFileNotFound(this.configFile);
    }

    return mergeConfig(require(this.configFile), overrides);
  }

  createSingleComponentConfig(overrides: RaguServerBaseConfigProps, componentPath: string, statePath?: string) {
    this.consoleLogger.info('You are running a single component task. ' +
        'However the given file will be ignored since you are using a custom adapter.');
    return this.createDirectoryConfig(overrides);
  }
}

@injectable()
export class CustomConfigAbstractFactory {
  constructor(private readonly consoleLogger: ConsoleLogger, private readonly detectInstallation: DetectInstallation) {
  }

  public build(configPath: string) {
    return new CustomConfigFactory(configPath, this.consoleLogger, this.detectInstallation);
  }
}
