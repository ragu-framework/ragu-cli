import {Args, SingleComponentBuildStrategy} from "../react/_config";
import {runDevWithCustomConfig} from "./_dev";


export default async (args: Args & SingleComponentBuildStrategy & {configFile: string}) => {
  await runDevWithCustomConfig(args)
}
