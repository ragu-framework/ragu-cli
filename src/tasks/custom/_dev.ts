import {Args, SingleComponentBuildStrategy} from "../react/_config";
import {ComponentsCompiler, RaguServer} from "ragu-server";
import {getAbsolutePath} from "../../path_extension";

export const runDevWithCustomConfig = async (args: Args & SingleComponentBuildStrategy & {configFile: string}) => {
  const config = require(getAbsolutePath(args.configFile));

  config.compiler.watchMode = true;

  const compiler = new ComponentsCompiler(config);
  const server = new RaguServer(config, compiler);

  await compiler.compileAll();
  await server.start();
}
