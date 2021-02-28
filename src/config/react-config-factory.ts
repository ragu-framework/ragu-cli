import {injectable} from "tsyringe";
import {RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {AdapterConfigFactory} from "./adapter-config-factory";

@injectable()
export class ReactConfigFactory implements AdapterConfigFactory {
  createDirectoryConfig(overrides: RaguServerBaseConfigProps) {
    const {createReactRaguServerConfig} = require("ragu-react-server-adapter/config");
    return createReactRaguServerConfig(overrides);
  }

  createSingleComponentConfig(overrides: RaguServerBaseConfigProps, componentPath: string, statePath?: string): RaguServerConfig {
    return {} as RaguServerConfig;
  }
}
