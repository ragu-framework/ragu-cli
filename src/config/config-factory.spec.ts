import {container} from "tsyringe";
import {ConfigFactory, DependenciesFileNotFoundError, WebpackConfigNotFoundError} from "./config-factory";
import {ResolverKind} from "../options/cli-options";
import {AvailableAdapters} from "../adapters/available-adapters";
import {ConsoleLogger, LogLevel, RaguServerBaseConfigProps} from "ragu-server";
import {ReactConfigFactory} from "./factories/react-config-factory";
import {VueConfigFactory} from "./factories/vue-config-factory";
import {CustomConfigAbstractFactory, CustomConfigFactory} from "./factories/custom-config-factory";
import {DetectInstallation} from "../adapters/detect-installation";
import * as path from "path";
import Mock = jest.Mock;
import {SimpleConfigFactory} from "./factories/simple-config-factory";

describe('ConfigFactory', () => {
  let configFactory: ConfigFactory;
  let reactConfigFactory: ReactConfigFactory;
  let vueConfigFactory: VueConfigFactory;
  let simpleConfigFactory: SimpleConfigFactory;
  let customConfigFactory: CustomConfigFactory;
  let customConfigAbstractFactory: CustomConfigAbstractFactory;

  beforeEach(() => {
    reactConfigFactory = new ReactConfigFactory();
    reactConfigFactory.createDirectoryConfig = jest.fn();
    reactConfigFactory.createSingleComponentConfig = jest.fn();

    vueConfigFactory = new VueConfigFactory();
    vueConfigFactory.createDirectoryConfig = jest.fn();
    vueConfigFactory.createSingleComponentConfig = jest.fn();

    simpleConfigFactory = new SimpleConfigFactory();
    simpleConfigFactory.createDirectoryConfig = jest.fn();
    simpleConfigFactory.createSingleComponentConfig = jest.fn();

    customConfigFactory = new CustomConfigFactory(
        'my-file-name.js',
        container.resolve(ConsoleLogger),
        container.resolve(DetectInstallation)
    );
    customConfigFactory.createDirectoryConfig = jest.fn();
    customConfigFactory.createSingleComponentConfig = jest.fn();

    customConfigAbstractFactory = new CustomConfigAbstractFactory(
        container.resolve(ConsoleLogger),
        container.resolve(DetectInstallation)
    );

    customConfigAbstractFactory.build = jest.fn(() => customConfigFactory);

    container.registerInstance(ReactConfigFactory, reactConfigFactory);
    container.registerInstance(VueConfigFactory, vueConfigFactory);
    container.registerInstance(SimpleConfigFactory, simpleConfigFactory);
    container.registerInstance(CustomConfigAbstractFactory, customConfigAbstractFactory);

    configFactory = container.resolve(ConfigFactory);
  })

  it('returns a react config when adapter is react', () => {
    configFactory.createConfig({
      resolve: {
        kind: ResolverKind.directory,
        path: 'path'
      },
      adapter: AvailableAdapters.react,
      logLevel: LogLevel.info,
      ssrEnabled: false
    });

    expect(reactConfigFactory.createDirectoryConfig).toBeCalledWith({
      server: {
        logging: {
          level: LogLevel.info
        }
      },
      ssrEnabled: false
    })
  });

  it('uses a given port', () => {
    configFactory.createConfig({
      resolve: {
        kind: ResolverKind.directory,
        path: 'path'
      },
      adapter: AvailableAdapters.react,
      logLevel: LogLevel.info,
      ssrEnabled: false,
      port: 4200
    });

    expect(reactConfigFactory.createDirectoryConfig).toBeCalledWith({
      server: {
        logging: {
          level: LogLevel.info
        },
        port: 4200
      },
      ssrEnabled: false
    })
  });

  it('returns a vue config when adapter is react', () => {
    configFactory.createConfig({
      resolve: {
        kind: ResolverKind.directory,
        path: 'path'
      },
      adapter: AvailableAdapters.vue,
      logLevel: LogLevel.info,
      ssrEnabled: false
    });

    expect(vueConfigFactory.createDirectoryConfig).toBeCalledWith({
      server: {
        logging: {
          level: LogLevel.info
        }
      },
      ssrEnabled: false
    })
  });

  it('returns a simple config when adapter is react', () => {
    configFactory.createConfig({
      resolve: {
        kind: ResolverKind.directory,
        path: 'path'
      },
      adapter: AvailableAdapters.simple,
      logLevel: LogLevel.info,
      ssrEnabled: false
    });

    expect(simpleConfigFactory.createDirectoryConfig).toBeCalledWith({
      server: {
        logging: {
          level: LogLevel.info
        }
      },
      ssrEnabled: false
    })
  });

  it('when output is defined', () => {
    configFactory.createConfig({
      resolve: {
        kind: ResolverKind.directory,
        path: 'path'
      },
      outputPath: '/bla',
      adapter: AvailableAdapters.react,
      logLevel: LogLevel.info,
      ssrEnabled: false
    });

    expect(reactConfigFactory.createDirectoryConfig).toBeCalledWith(
      expect.objectContaining({
        compiler: {
          output: {
            directory: '/bla'
          }
        }
      })
    );
  });

  it('sets baseurl when it is defined', () => {
    configFactory.createConfig({
      resolve: {
        kind: ResolverKind.directory,
        path: 'path'
      },
      baseurl: 'http://ragu-is-cool/',
      adapter: AvailableAdapters.react,
      logLevel: LogLevel.info,
      ssrEnabled: false
    });

    expect(reactConfigFactory.createDirectoryConfig).toBeCalledWith(
        expect.objectContaining({
          baseurl: 'http://ragu-is-cool/'
        })
    );
  });

  describe('providing webpack', () => {
    it('sets webpack when it is defined', () => {
      configFactory.createConfig({
        resolve: {
          kind: ResolverKind.directory,
          path: 'path'
        },
        adapter: AvailableAdapters.react,
        webpack: path.join(__dirname, '_testing', 'config-file.js'),
        logLevel: LogLevel.info,
        ssrEnabled: false
      });

      const expected: RaguServerBaseConfigProps = {
        compiler: {
          webpack: {
            clientSide: {
              customConfig: true,
            } as any
          }
        }
      };
      expect(reactConfigFactory.createDirectoryConfig).toBeCalledWith(
          expect.objectContaining(expected)
      );
    });

    it('throws an exception when webpack not found', () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      const webpackNotFound = path.join(__dirname, '_testing', 'webpack-not-found.js');

      expect(() => configFactory.createConfig({
        resolve: {
          kind: ResolverKind.directory,
          path: 'path'
        },
        adapter: AvailableAdapters.react,
        webpack: webpackNotFound,
        logLevel: LogLevel.info,
        ssrEnabled: false
      })).toThrow(new WebpackConfigNotFoundError(webpackNotFound));

      const debug: Mock = console.log as Mock;
      expect(debug).not.toBeCalled();
    });

    it('logs error when debug mode', () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      const webpackNotFound = path.join(__dirname, '_testing', 'webpack-not-found.js');

      expect(() => configFactory.createConfig({
        resolve: {
          kind: ResolverKind.directory,
          path: 'path'
        },
        adapter: AvailableAdapters.react,
        webpack: webpackNotFound,
        logLevel: LogLevel.debug,
        ssrEnabled: false
      })).toThrow(new WebpackConfigNotFoundError(webpackNotFound));

      const debug: Mock = console.log as Mock;
      expect(debug.mock.calls[0][0].message).toEqual(expect.stringContaining("Cannot find module"));
    });

    it('sets webpack server side when it is defined', () => {
      configFactory.createConfig({
        resolve: {
          kind: ResolverKind.directory,
          path: 'path'
        },
        adapter: AvailableAdapters.react,
        webpackServerSide: path.join(__dirname, '_testing', 'config-file.js'),
        logLevel: LogLevel.debug,
        ssrEnabled: false
      });

      const expected: RaguServerBaseConfigProps = {
        compiler: {
          webpack: {
            serverSide: {
              customConfig: true,
            } as any
          }
        }
      };
      expect(reactConfigFactory.createDirectoryConfig).toBeCalledWith(
          expect.objectContaining(expected)
      );
    });
  });

  describe('when mapping dependencies', () => {
    it('provides default dependencies', () => {
      configFactory.createConfig({
        resolve: {
          kind: ResolverKind.directory,
          path: 'path'
        },
        baseurl: 'http://ragu-is-cool/',
        adapter: AvailableAdapters.react,
        logLevel: LogLevel.info,
        ssrEnabled: false,
        dependencies: path.resolve(__dirname, '_testing', 'dependency.json')
      });

      expect(reactConfigFactory.createDirectoryConfig).toBeCalledWith(
        expect.objectContaining({
          components: {
            defaultDependencies: [{
              "dependency": "My Dependency"
            }]
          }
        })
      );
    });

    it('throws an error given an invalid dependency file', () => {
      const dependenciesPath = path.resolve(__dirname, '_testing', 'dependency-not-found.json');
      const createConfig = () => configFactory.createConfig({
        resolve: {
          kind: ResolverKind.directory,
          path: 'path'
        },
        baseurl: 'http://ragu-is-cool/',
        adapter: AvailableAdapters.react,
        logLevel: LogLevel.info,
        ssrEnabled: false,
        dependencies: dependenciesPath
      });

      expect(createConfig).toThrow(new DependenciesFileNotFoundError(dependenciesPath));
    });
  });

  describe('given a custom adapter', () => {
    it('returns the given config', () => {
      configFactory.createConfig({
        adapter: AvailableAdapters.custom,
        configFile: 'my-config-file.js',
        ssrEnabled: true,
        logLevel: LogLevel.info
      });

      expect(customConfigAbstractFactory.build).toBeCalledWith('my-config-file.js');
      expect(customConfigFactory.createDirectoryConfig).toBeCalledWith({
        server: {
          logging: {
            level: LogLevel.info
          }
        },
        ssrEnabled: true
      });
    });
  });

  describe('when using a file', () => {
    it('returns a react config when adapter is react', () => {
      configFactory.createConfig({
        resolve: {
          kind: ResolverKind.file,
          path: 'myFile',
          statePath: 'myState'
        },
        adapter: AvailableAdapters.react,
        logLevel: LogLevel.info,
        ssrEnabled: false
      });

      expect(reactConfigFactory.createSingleComponentConfig).toBeCalledWith(
        {
          server: {
            logging: {
              level: LogLevel.info
            }
          },
          ssrEnabled: false
        },
        'myFile',
        'myState'
      )
    });
  });
});
