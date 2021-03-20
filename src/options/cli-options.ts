import {LogLevel} from "ragu-server";
import {AvailableAdapters, NonCustomAdapters} from "../adapters/available-adapters";
import {injectable} from "tsyringe";
import * as path from "path";

export enum ResolverKind {
  file = 'file',
  directory = 'directory'
}

type ResolveOption = {
  path: string;
  statePath?: string;
  kind: ResolverKind;
};

export interface AutoResolveOption {
  resolve: ResolveOption;
  adapter?: NonCustomAdapters;
  configFile?: string;
}

export interface CustomConfigOption {
  adapter: AvailableAdapters.custom;
  configFile: string
}

export type ResolutionMode = AutoResolveOption | CustomConfigOption;

export type CliOptions = ResolutionMode & {
  ssrEnabled: boolean;
  logLevel: LogLevel;
  webpack?: string;
  webpackServerSide?: string;
  baseurl?: string;
  port?: number;
  outputPath?: string;
  dependencies?: string;
}

export interface CliInput {
  ssrEnabled?: boolean;
  file?: string;
  stateFile?: string;
  dependencies?: string;
  directory?: string;
  log?: string;
  webpack?: string;
  webpackServerSide?: string;
  adapter?: string;
  baseurl?: string;
  configFile?: string;
  port?: string;
  outputPath?: string
}

interface InputOptionCli {
  boolean?: boolean;
  description: string
}

export class NoComponentResolveSpecifiedError extends Error {
  constructor() {
    super("You must specify a file or a directory");
  }
}

export class StateCannotBeSetWhenUsingDirectoryResolverError extends Error {
  constructor() {
    super("You should not provide a state file when resolving components by directory.");
  }
}


export class InvalidOption extends Error {
  constructor(field: string, value: string) {
    super(`"${value}" is a not valid value for ${field}.`);
  }
}

export class RequiredConfigFileForCustomAdapterError extends Error {
  constructor() {
    super('You must specify a config file given a custom adapter.');
  }

}

@injectable()
export class CliOptionsParser {
  parseInput(input: CliInput): CliOptions {
    const resolutionMode = CliOptionsParser.parseResolutionMode(input);

    const webpack = CliOptionsParser.parseUserProvidedPath(input.webpack);
    const webpackServerSide = CliOptionsParser.parseUserProvidedPath(input.webpackServerSide);

    return {
      configFile: CliOptionsParser.parseUserProvidedPath(input.configFile),
      baseurl: input.baseurl,
      dependencies: CliOptionsParser.parseUserProvidedPath(input.dependencies),
      outputPath: CliOptionsParser.parseUserProvidedPath(input.outputPath),
      webpack,
      webpackServerSide: webpackServerSide ? webpackServerSide : webpack,
      port: CliOptionsParser.parsePort(input),
      ssrEnabled: CliOptionsParser.parseSsrEnabled(input),
      logLevel: CliOptionsParser.parseLogLevel(input),
      ...resolutionMode
    }
  }


  private static parseUserProvidedPath(providedPath: string): string;
  private static parseUserProvidedPath(providedPath?: string): undefined;
  private static parseUserProvidedPath(providedPath: string | undefined): string | undefined {
    if (providedPath === undefined) {
      return;
    }

    return path.resolve(process.cwd(), providedPath);
  }

  private static parsePort(input: CliInput): number | undefined {
    if (!input.port) {
      return;
    }
    const port = parseInt(input.port);

    if (isNaN(port) || port <= 0) {
      throw new InvalidOption('port', input.port);
    }

    return port
  }

  private static parseResolutionMode(input: CliInput): ResolutionMode {
    const adapter = this.parseAdapter(input);

    if (adapter !== AvailableAdapters.custom) {
      return {
        adapter,
        resolve: CliOptionsParser.parseResolver(input),
      }
    }

    if (!input.configFile) {
      throw new RequiredConfigFileForCustomAdapterError();
    }

    return {
      adapter: AvailableAdapters.custom,
      configFile: input.configFile,
    }
  }

  private static parseAdapter(input: CliInput): AvailableAdapters | undefined {
    if (!input.adapter) {
      return;
    }

    const adaptersName: Record<AvailableAdapters, AvailableAdapters> = {
      react: AvailableAdapters.react,
      vue: AvailableAdapters.vue,
      custom: AvailableAdapters.custom,
      simple: AvailableAdapters.simple
    };

    return CliOptionsParser.translateMapToValue('adapter', input.adapter, adaptersName);
  }

  private static parseLogLevel(input: CliInput) {
    if (!input.log) {
      return LogLevel.warn;
    }

    return CliOptionsParser.translateMapToValue('log', input.log, {
      debug: LogLevel.debug,
      info: LogLevel.info,
      warn: LogLevel.warn,
      error: LogLevel.error,
    });
  }

  private static translateMapToValue<T>(key: string, value: string, map: Record<string, T>): T {
    const logLevel = map[value];

    if (logLevel === undefined) {
      throw new InvalidOption(key, value);
    }

    return logLevel;
  }

  private static parseSsrEnabled(input: CliInput) {
    return !!input.ssrEnabled;
  }

  private static parseResolver(input: CliInput): ResolveOption {
    if (input.file) {
      return {
        path: CliOptionsParser.parseUserProvidedPath(input.file),
        kind: ResolverKind.file,
        statePath: CliOptionsParser.parseUserProvidedPath(input.stateFile)
      }
    }

    if (input.directory) {
      if (input.stateFile) {
        throw new StateCannotBeSetWhenUsingDirectoryResolverError();
      }

      return {
        path: CliOptionsParser.parseUserProvidedPath(input.directory),
        kind: ResolverKind.directory
      }
    }

    throw new NoComponentResolveSpecifiedError();
  }
}

export const availableOptions: Record<keyof CliInput, InputOptionCli> = {
  ssrEnabled: {
    boolean: true,
    description: 'Enables SSR'
  },
  file: {
    description: 'Your component file'
  },
  stateFile: {
    description: 'Your component file'
  },
  dependencies: {
    description: 'Project external dependencies'
  },
  directory: {
    description: 'The directory for multiple components server'
  },
  log: {
    description: 'The application log level: debug, info, warn, error'
  },
  adapter: {
    description: 'The adapter for your component: react, vue, custom'
  },
  baseurl: {
    description: 'Your component baseurl where you component will be deployed'
  },
  configFile: {
    description: 'A custom config file'
  },
  port: {
    description: 'The server port'
  },
  outputPath: {
    description: 'Where your component will be built. Default: .ragu-components'
  },
  webpack: {
    description: 'A custom webpack config'
  },
  webpackServerSide: {
    description: 'A custom webpack config for SSR. Default: It will assume the same value provided for --webpack'
  }
}
