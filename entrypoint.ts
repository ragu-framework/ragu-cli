#!/usr/bin/env node
import {Command} from 'commander';
import {Application} from "./src/application";
import {CliInput} from "./src/options/cli-options";
import {DevServer} from "./src/commands/dev-server";
import {BuildStatic} from "./src/commands/build-static";
import {Server} from "./src/commands/server";

const packageJson = require('./package.json');

const program = new Command();

program
    .description('Welcome to ragu-cli. Check the list of commands bellow:')
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

const commands = [
  {
    name: 'dev',
    description: 'Starts ragu server in development mode for the given component.',
    command: DevServer
  },
  {
    name: 'static',
    description: "Build the project as a static ragu project",
    command: BuildStatic
  },
  {
    name: 'build',
    description: "Build the project to production",
    command: BuildStatic
  },
  {
    name: 'serve',
    description: "Production server. You must the same options given for build command.",
    command: Server
  }
]

commands.forEach((command) => {
  defaultOptions(program
      .command(command.name)
      .description(command.description))
      .action((input: CliInput) => {
        Application.init(input).execute(command.command)
      });
});

program.parse();
