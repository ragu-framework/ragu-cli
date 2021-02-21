#!/usr/bin/env node
import {Command} from 'commander';
import {detectFramework, SupportedFrameworks} from "./src/detect-framework";
import {ConsoleLogger} from "ragu-server";
const packageJson = require('./package.json');

const program = new Command();

export interface Options {
  adapter?: string;
  debug: boolean;
  ssr: boolean
}


program
    .version(packageJson.version);

const log = new ConsoleLogger();

const getFramework = (options: Options): SupportedFrameworks | null => {
  if (options.adapter) {
    if (options.adapter === 'react' || options.adapter === 'vue' || options.adapter === 'custom') {
      return options.adapter
    }

    log.error(`The provided adapter is not supported: ${options.adapter}`);
    return null;
  }

  const detectedFramework = detectFramework();

  if (detectedFramework) {
    return detectedFramework
  }

  log.error(`It was not possible to auto detect the used framework. Provide a adapter by --adapter`);
  return null;
}

const setDefaultOptions = (program: Command | any): Command => {
  return program
      .option('-a, --adapter <adapter>', 'The framework adapter: react, vue')
      .option('--ssr', 'activate the Server Side Rendering Mode')
      .option('-c, --configFile <configFile>', 'A custom config file')
      .option('-d, --debug', 'output extra debugging', false);
}

const getCommand = (commandName: string, options: Options) => {
  let framework = getFramework(options);
  if (framework) {
    log.info(`Running command using ${framework} adapter`);

    const {default: command} = require(`./src/tasks/${framework}/${commandName}`);

    return command;
  }
}

setDefaultOptions(program
    .command('dev <componentFile> [stateFile]')
    .description('Starts the ragu server in development mode for the given component.'))
    .action((componentFile, stateFile, options: Options) => {
      if (options.debug) {
        console.log({...options, componentFile, stateFile});
      }
      const command = getCommand('dev', options);

      if (command) {
        command({
          ...options,
          strategy: 'single',
          fileName: componentFile,
          stateFile,
          ssrEnabled: options.ssr
        });
      }
    });

setDefaultOptions(program
    .command('dev:directory <componentsDirectory>')
    .description('Starts the ragu server in development mode at the given directory.'))
    .action((componentsDirectory, options: Options) => {
      if (options.debug) {
        console.log({...options, componentsDirectory});
      }

      const command = getCommand('dev_multi', options);
      if (command) {

        command({
          ...options,
          strategy: 'single',
          componentsDirectory,
          ssrEnabled: options.ssr
        });
      }
    });

program.parse();
