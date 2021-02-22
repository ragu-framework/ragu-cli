import {ComponentsCompiler} from "ragu-server";
import {Args, createConfig, DirectoryComponentBuildStrategy} from "./_config";


export default async (args: Args & DirectoryComponentBuildStrategy) => {
  const config = createConfig({...args, strategy: "directory"});

  config.static = true;

  const compiler = new ComponentsCompiler(config);
  await compiler.compileAll();
}
