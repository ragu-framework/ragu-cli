import {injectable} from "tsyringe";
import {RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";
import {AdapterConfigFactory} from "../adapter-config-factory";

@injectable()
export class VueConfigFactory implements AdapterConfigFactory {
  createDirectoryConfig(overrides: RaguServerBaseConfigProps): RaguServerConfig {
    const {createVueRaguServerConfig} = require('ragu-vue-server-adapter/config');
    return createVueRaguServerConfig(overrides);
  }

  createSingleComponentConfig(overrides: RaguServerBaseConfigProps, componentPath: string, statePath?: string): RaguServerConfig {
    return {} as RaguServerConfig;
  }
}
