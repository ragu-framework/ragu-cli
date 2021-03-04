import {injectable} from "tsyringe";
import {RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {AdapterConfigFactory} from "../adapter-config-factory";
import {removeExtension} from "../../path_extension";

@injectable()
export class SimpleConfigFactory implements AdapterConfigFactory {
  createDirectoryConfig(overrides: RaguServerBaseConfigProps) {
    const {createRaguSimpleConfig} = require("ragu-simple-adapter/config");
    return createRaguSimpleConfig(overrides);
  }

  createSingleComponentConfig(overrides: RaguServerBaseConfigProps, componentPath: string, statePath?: string): RaguServerConfig {
    const {SimpleSingleComponentResolver} = require("ragu-simple-adapter/component-resolver");
    const config = this.createDirectoryConfig(overrides);

    config.components.resolver = new SimpleSingleComponentResolver(
        config,
        removeExtension(componentPath),
        statePath && removeExtension(statePath)
    );

    return config;
  }
}
