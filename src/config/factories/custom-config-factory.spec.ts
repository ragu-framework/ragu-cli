import {container} from "tsyringe";
import {ConfigFileNotFound, CustomConfigAbstractFactory, InvalidCustomConfigOverride} from "./custom-config-factory";
import * as path from "path";
import {ConsoleLogger} from "ragu-server";

describe('CustomConfigFactory', () => {
  it('returns the given file', () => {
    const customConfigAbstractFactory = container.resolve(CustomConfigAbstractFactory);

    const factory = customConfigAbstractFactory
        .build(path.resolve(__dirname, '..', '_testing', 'config-file.js'));

    expect(factory.createDirectoryConfig({}))
        .toEqual({
          customConfig: true,
        });
  });

  it('enables ssr', () => {
    const customConfigAbstractFactory = container.resolve(CustomConfigAbstractFactory);

    const factory = customConfigAbstractFactory
        .build(path.resolve(__dirname, '..', '_testing', 'config-file.js'));

    expect(factory.createDirectoryConfig({
      ssrEnabled: true
    }))
        .toEqual({
          customConfig: true,
          ssrEnabled: true
        });
  });

  it('throws an exception when trying to updates the output directory', () => {
    const customConfigAbstractFactory = container.resolve(CustomConfigAbstractFactory);

    const factory = customConfigAbstractFactory
        .build(path.resolve(__dirname, '..', '_testing', 'config-file.js'));

    expect(() => factory.createDirectoryConfig({
      compiler: {
        output: {
          directory: 'laal'
        }
      }
    })).toThrow(new InvalidCustomConfigOverride('output'))
  });

  it('throws an exception when the file does not exists', () => {
    const customConfigAbstractFactory = container.resolve(CustomConfigAbstractFactory);

    const configPath = path.resolve(__dirname, '..', '_testing', 'not-found.js');

    const factory = customConfigAbstractFactory
        .build(configPath);

    expect(() => factory.createDirectoryConfig({}))
        .toThrow(new ConfigFileNotFound(configPath))
  });

  it('shows an info saying that it will ignore file and state file for file config', () => {
    const customConfigAbstractFactory = container.resolve(CustomConfigAbstractFactory);

    const factory = customConfigAbstractFactory
        .build(path.resolve(__dirname, '..', '_testing', 'config-file.js'));

    expect(factory.createSingleComponentConfig({}, 'my-file.js')).toEqual({
      customConfig: true,
    });

    expect(container.resolve(ConsoleLogger).info).toBeCalledWith(
        'You are running a single component task. However the given file will be ignored since you are using a custom adapter.')
  });
});
