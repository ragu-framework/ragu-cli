#!/usr/bin/env node
import {Command} from 'commander';
import {Application} from "./src/application";
import {availableOptions, CliInput} from "./src/options/cli-options";
import {DevServer} from "./src/commands/dev-server";
import {BuildStatic} from "./src/commands/build-static";
import {Server} from "./src/commands/server";
import {Build} from "./src/commands/build";

const packageJson = require('./package.json');

const program = new Command();

program
    .description('Welcome to ragu-cli. Check the list of commands bellow:')
    .version(packageJson.version);

const defaultOptions = (program: Command | any): Command => {
  for (const option of Object.keys(availableOptions) as (keyof CliInput)[]) {
    const optionDescription = availableOptions[option];

    if (optionDescription.boolean) {
      program = program.option(`--${option}`, optionDescription.description)
    } else {
      program = program.option(`--${option} <${option}>`, optionDescription.description)
    }
  }

  return program
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
    command: Build
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
