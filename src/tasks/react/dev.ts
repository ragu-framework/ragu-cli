import {ComponentsCompiler, RaguServer} from "ragu-server";
import {Args, createDevConfig, SingleComponentBuildStrategy} from "./_config";
import {getAbsolutePath, removeExtension} from "../../path_extension";
import {ReactSingleComponentResolver} from "ragu-react-server-adapter/component-resolver";


export default async (args: Args & SingleComponentBuildStrategy) => {
  const config = createDevConfig({...args, strategy: "single"});
  const stateFile = args.stateFile ? removeExtension(getAbsolutePath(args.stateFile)) : undefined;

  config.components.resolver = new ReactSingleComponentResolver(
      config,
      removeExtension(getAbsolutePath(args.fileName)),
      stateFile
  );

  const compiler = new ComponentsCompiler(config);
  const server = new RaguServer(config, compiler);

  await compiler.compileAll();
  await server.start();
}
