import {createReactRaguServerConfig} from "ragu-react-server-adapter/config";
import {ConsoleLogger, Dependency, RaguServerBaseConfigProps} from "ragu-server";
import {getAbsolutePath} from "../../path_extension";

export type SingleComponentBuildStrategy = {
  strategy?: 'single';
  fileName: string;
  stateFile?: string
};

export type DirectoryComponentBuildStrategy = {
  strategy: 'directory';
  componentsDirectory: string
};

type BuildStrategy = SingleComponentBuildStrategy | DirectoryComponentBuildStrategy

export type Args = {
  configFile?: string;
  host?: string;
  output?: string;
  dependencies?: string;
  ssrEnabled: boolean
} & BuildStrategy

const log = new ConsoleLogger();

const getConfig = (args: Args) => {
  if (args.configFile) {
    log.info('Using the given config file.');
    return require(getAbsolutePath(args.configFile));
  }

  let extraConfig: RaguServerBaseConfigProps = {}

  if (args.dependencies) {
    const dependencies: Dependency[] = require(getAbsolutePath(args.dependencies))

    extraConfig = {
      ...extraConfig,
      components: {
        defaultDependencies: dependencies
      }
    }
  }

  if (args.output) {
    extraConfig = {
      ...extraConfig,
      compiler: {
        output: {
          directory: args.output
        }
      }
    }
  }

  if (args.host) {
    extraConfig = {
      ...extraConfig,
      baseurl: args.host,
      server: {
        routes: {
          assets: '/compiled/client-side/'
        }
      }
    }
  }

  return createReactRaguServerConfig(extraConfig);
}

export const createConfig = (args: Args) => {
  const config = getConfig(args);

  config.ssrEnabled = args.ssrEnabled;
  return config;
}

export const createDevConfig = (args: Args) => {
  const config = createConfig(args);

  config.compiler.watchMode = true;

  return config;
}
