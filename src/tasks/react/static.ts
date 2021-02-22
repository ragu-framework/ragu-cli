import {ComponentsCompiler, RaguServer} from "ragu-server";
import {Args, createConfig, SingleComponentBuildStrategy} from "./_config";
import {getAbsolutePath, removeExtension} from "../../path_extension";
import {ReactSingleComponentResolver} from "ragu-react-server-adapter/component-resolver";


export default async (args: Args & SingleComponentBuildStrategy) => {
  const config = createConfig({...args, strategy: "single", ssrEnabled: false});

  config.static = true;

  config.components.resolver = new ReactSingleComponentResolver(
      config,
      removeExtension(getAbsolutePath(args.fileName))
  );

  const compiler = new ComponentsCompiler(config);
  await compiler.compileAll();
}
