import {injectable} from "tsyringe";
import {RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {AdapterConfigFactory} from "./adapter-config-factory";
import {ReactSingleComponentResolver} from "ragu-react-server-adapter/component-resolver";
import {removeExtension} from "../path_extension";

@injectable()
export class ReactConfigFactory implements AdapterConfigFactory {
  createDirectoryConfig(overrides: RaguServerBaseConfigProps) {
    const {createReactRaguServerConfig} = require("ragu-react-server-adapter/config");
    return createReactRaguServerConfig(overrides);
  }

  createSingleComponentConfig(overrides: RaguServerBaseConfigProps, componentPath: string, statePath?: string): RaguServerConfig {
    const config = this.createDirectoryConfig(overrides);

    config.components.resolver = new ReactSingleComponentResolver(
        config,
        removeExtension(componentPath),
        statePath && removeExtension(statePath)
    );

    return config;
  }
}
