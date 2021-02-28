import {RaguServerBaseConfigProps, RaguServerConfig} from "ragu-server";

export interface AdapterConfigFactory {
  createDirectoryConfig: (overrides: RaguServerBaseConfigProps) => RaguServerConfig;
  createSingleComponentConfig: (overrides: RaguServerBaseConfigProps, componentPath: string, statePath?: string) => RaguServerConfig;
}
