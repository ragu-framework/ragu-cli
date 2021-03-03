import {injectable} from "tsyringe";
import {CliOptions, ResolverKind} from "../options/cli-options";
import {RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {ReactConfigFactory} from "./factories/react-config-factory";
import {AdapterConfigFactory} from "./adapter-config-factory";
import {AvailableAdapters} from "../adapters/available-adapters";
import {VueConfigFactory} from "./factories/vue-config-factory";
import {CustomConfigAbstractFactory} from "./factories/custom-config-factory";
import {DetectInstallation} from "../adapters/detect-installation";


export class DependenciesFileNotFoundError extends Error {
  constructor(filename: string) {
    super(`Could not open the dependencies file: ${filename}`);
  }
}


@injectable()
export class ConfigFactory {
  constructor(private readonly reactConfigFactory: ReactConfigFactory,
              private readonly vueConfigFactory: VueConfigFactory,
              private readonly customConfigAbstractFactory: CustomConfigAbstractFactory,
              private readonly detectInstallation: DetectInstallation) {
  }

  public createConfig(options: CliOptions): RaguServerConfig {
    const factory = this.getConfigFactory(options);

    const overrides: RaguServerBaseConfigProps = {
      server: {
        logging: {
          level: options.logLevel
        },
        ...ConfigFactory.partialObjectFor('port', options.port)
      },
      ssrEnabled: options.ssrEnabled,
      ...ConfigFactory.outputConfigFor(options),
      ...ConfigFactory.baseUrlFor(options),
      ...this.dependenciesFor(options)
    };

    if (options.adapter !== AvailableAdapters.custom && options.resolve.kind === ResolverKind.file) {
      return factory.createSingleComponentConfig(overrides, options.resolve.path, options.resolve.statePath)
    }

    return factory.createDirectoryConfig(overrides);
  }

  private static partialObjectFor<T>(key: string, value?: T): Record<string, T> {
    if (!value) {
      return {};
    }

    return {
      [key]: value
    };
  }

  private getConfigFactory(options: CliOptions): AdapterConfigFactory {
    if (options.adapter === AvailableAdapters.custom) {
      return this.customConfigAbstractFactory.build(options.configFile);
    }

    if (options.adapter === AvailableAdapters.react) {
      return this.reactConfigFactory;
    }

    return this.vueConfigFactory;
  }

  private static outputConfigFor(options: CliOptions): RaguServerBaseConfigProps {
    if (options.outputPath) {
      return {
        compiler: {
          output: {
            directory: options.outputPath
          }
        }
      }
    }
    return {};
  }

  private static baseUrlFor(options: CliOptions): RaguServerBaseConfigProps {
    if (options.baseurl) {
      return {
        baseurl: options.baseurl
      }
    }

    return {};
  }

  private dependenciesFor(options: CliOptions): RaguServerBaseConfigProps {
    if (!options.dependencies) {
      return {};
    }

    if (!this.detectInstallation.isPackageAvailable(options.dependencies)) {
      throw new DependenciesFileNotFoundError(options.dependencies);
    }

    return {
      components: {
        defaultDependencies: require(options.dependencies)
      }
    }
  }
}
