#!/usr/bin/env node
import {Command} from 'commander';
import {Application} from "./src/application";
import {CliInput} from "./src/options/cli-options";
import {DevServer} from "./src/commands/dev-server";

const packageJson = require('./package.json');

const program = new Command();

program
    .version(packageJson.version);

const defaultOptions = (program: Command | any): Command => {
  return program
      .option('--ssrEnabled', 'Enables SSR')
      .option('--file <file>', 'Your component file')
      .option('--stateFile <stateFile>', 'Your component file')
      .option('--dependencies <dependencies>', 'Project external dependencies')
      .option('--directory <directory>', 'The directory for multiple components server')
      .option('--log <log>', 'The application log level: debug, info, warn, error')
      .option('--adapter <adapter>', 'The adapter for your component: react, vue, custom')
      .option('--baseurl <baseurl>', 'Your component baseurl where you component will be deployed')
      .option('--configFile <configFile>', 'A custom config file')
      .option('--port <port>', 'The server port')
      .option('--outputPath <outputPath>', 'Where your component will be built. Default: .ragu-components')
}

defaultOptions(program
    .command('dev')
    .description('Starts ragu server in development mode for the given component.'))
    .action((input: CliInput) => {
      Application.init(input).execute(DevServer)
    });

program.parse();
