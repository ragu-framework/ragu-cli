import {injectable} from "tsyringe";
import {CliOptions, ResolverKind} from "../options/cli-options";
import {ConsoleLogger, LogLevel, RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {ReactConfigFactory} from "./factories/react-config-factory";
import {AdapterConfigFactory} from "./adapter-config-factory";
import {AvailableAdapters} from "../adapters/available-adapters";
import {VueConfigFactory} from "./factories/vue-config-factory";
import {CustomConfigAbstractFactory} from "./factories/custom-config-factory";
import {DetectInstallation} from "../adapters/detect-installation";
import {SimpleConfigFactory} from "./factories/simple-config-factory";


export class DependenciesFileNotFoundError extends Error {
  constructor(filename: string) {
    super(`Could not open the dependencies file: ${filename}`);
  }
}


export class WebpackConfigNotFoundError extends Error {
  constructor(filename: string) {
    super(`Could not open the ${filename} webpack config config`);
  }
}

@injectable()
export class ConfigFactory {
  constructor(private readonly reactConfigFactory: ReactConfigFactory,
              private readonly vueConfigFactory: VueConfigFactory,
              private readonly simpleConfigFactory: SimpleConfigFactory,
              private readonly customConfigAbstractFactory: CustomConfigAbstractFactory,
              private readonly detectInstallation: DetectInstallation,
              private readonly consoleLogger: ConsoleLogger) {
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
      ...this.compilerConfigFor(options),
      ...ConfigFactory.baseUrlFor(options),
      ...this.componentsFor(options)
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
    if (options.present) {
      const present = require(`${options.present}/ragu-cli`);
      return (present.default || present).ConfigFactory;
    }
    
    if (options.adapter === AvailableAdapters.custom) {
      return this.customConfigAbstractFactory.build(options.configFile);
    }

    if (options.adapter === AvailableAdapters.react) {
      return this.reactConfigFactory;
    }

    if (options.adapter === AvailableAdapters.simple) {
      return this.simpleConfigFactory;
    }

    return this.vueConfigFactory;
  }

  private compilerConfigFor(options: CliOptions): RaguServerBaseConfigProps {
    const compilerOptions = {
      ...ConfigFactory.outputConfigFor(options),
      ...this.webpackFor(options)
    }

    if (Object.keys(compilerOptions).length === 0) {
      return {}
    }

    return {
      compiler: {
        ...compilerOptions
      }
    }
  }

  private static outputConfigFor(options: CliOptions) {
    if (options.outputPath) {
      return {
        output: {
          directory: options.outputPath
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

  private componentsFor(options: CliOptions): RaguServerBaseConfigProps {
    const defaultDependencies = this.dependenciesFor(options);
    const sourceRoot = this.sourceRootFor(options);

    const components = {
      ...defaultDependencies,
      ...sourceRoot
    };

    if (Object.keys(components).length === 0) {
      return {};
    }

    return {
      components: components
    }
  }

  private dependenciesFor(options: CliOptions) {
    if (!options.dependencies) {
      return {};
    }

    if (!this.detectInstallation.isPackageAvailable(options.dependencies)) {
      throw new DependenciesFileNotFoundError(options.dependencies);
    }

    return {
      defaultDependencies: require(options.dependencies)
    };
  }

  private sourceRootFor(options: CliOptions) {
    if (options.adapter === AvailableAdapters.custom || options.resolve.kind !== ResolverKind.directory) {
      return {}
    }

    return {
      sourceRoot: options.resolve.path
    }
  }

  private webpackFor(options: CliOptions) {
    if (!options.webpack && !options.webpackServerSide) {
      return {};
    }

    return {
      webpack: {
        ...this.getWebpackConfig(options.webpack, 'clientSide', options),
        ...this.getWebpackConfig(options.webpackServerSide, 'serverSide', options),
      }
    }
  }

  private getWebpackConfig(filename: string | undefined, key: string, options: CliOptions) {
    if (!filename) {
      return;
    }

    try {
      return {
        [key]: require(filename)
      };
    } catch (e) {
      if (options.logLevel === LogLevel.debug) {
        console.log(e);
      }
      throw new WebpackConfigNotFoundError(filename);
    }
  }
}
