import {injectable} from "tsyringe";
import {RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {AdapterConfigFactory} from "../adapter-config-factory";
import {removeExtension} from "../../path_extension";

@injectable()
export class VueConfigFactory implements AdapterConfigFactory {
  createDirectoryConfig(overrides: RaguServerBaseConfigProps): RaguServerConfig {
    const {createVueRaguServerConfig} = require('ragu-vue-server-adapter/config');
    return createVueRaguServerConfig(overrides);
  }

  createSingleComponentConfig(overrides: RaguServerBaseConfigProps, componentPath: string, statePath?: string): RaguServerConfig {
    const {VueComponentSingleComponentResolver} = require("ragu-vue-server-adapter/component-resolver");
    const config = this.createDirectoryConfig(overrides);

    config.components.resolver = new VueComponentSingleComponentResolver(
        config,
        removeExtension(componentPath),
        statePath && removeExtension(statePath)
    );

    return config;
  }
}
