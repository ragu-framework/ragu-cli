import {ComponentsCompiler, RaguServer} from "ragu-server";
import {Args, createDevConfig, DirectoryComponentBuildStrategy, SingleComponentBuildStrategy} from "./_config";
import {getAbsolutePath} from "../../path_extension";


export default async (args: Args & DirectoryComponentBuildStrategy) => {
  const config = createDevConfig({...args, strategy: "directory"});

  config.components.sourceRoot = getAbsolutePath(args.componentsDirectory);

  const compiler = new ComponentsCompiler(config);
  const server = new RaguServer(config, compiler);

  await compiler.compileAll();
  await server.start();
}
