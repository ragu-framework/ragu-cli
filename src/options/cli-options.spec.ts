import {container} from "tsyringe";
import {
  CliOptionsParser,
  InvalidOption,
  NoComponentResolveSpecifiedError,
  RequiredConfigFileForCustomAdapterError,
  ResolverKind,
  StateCannotBeSetWhenUsingDirectoryResolverError
} from "./cli-options";
import {LogLevel} from "ragu-server";
import {AvailableAdapters} from "../adapters/available-adapters";
import * as path from "path";

describe('CliOptionsParser', () => {
  let parser: CliOptionsParser;
  const basicConfig = {
    file: 'my-comp.js'
  };

  beforeEach(() => {
    parser = container.resolve(CliOptionsParser);
  })

  describe('detecting resolvers', () => {
    it('returns a parsed file input', () => {
      expect(
          parser.parseInput(basicConfig)
      ).toEqual({
        resolve: {
          kind: ResolverKind.file,
          path: path.join(process.cwd(), 'my-comp.js')
        },
        ssrEnabled: false,
        logLevel: LogLevel.info
      });
    });

    describe('parsing state', () => {
      it('returns a parsed state file input', () => {
        expect(
            parser.parseInput({...basicConfig, stateFile: 'my-state.js'})
        ).toEqual({
          resolve: {
            kind: ResolverKind.file,
            path: path.join(process.cwd(), 'my-comp.js'),
            statePath: path.join(process.cwd(), 'my-state.js')
          },
          ssrEnabled: false,
          logLevel: LogLevel.info
        });
      });

      it('throws an exception given a directory resolver and a state file', () => {
        expect(() => parser.parseInput({directory: '/my-comps', stateFile: 'my-state.js'}))
            .toThrow(new StateCannotBeSetWhenUsingDirectoryResolverError());
      });
    });

    it('returns an absolute parsed directory input', () => {
      expect(
          parser.parseInput({
            directory: '/my-comps'
          })
      ).toEqual({
        resolve: {
          kind: ResolverKind.directory,
          path: '/my-comps'
        },
        ssrEnabled: false,
        logLevel: LogLevel.info
      });
    });

    it('returns a parsed directory input', () => {
      expect(
          parser.parseInput({
            directory: 'my-comps'
          })
      ).toEqual({
        resolve: {
          kind: ResolverKind.directory,
          path: path.join(process.cwd(), 'my-comps')
        },
        ssrEnabled: false,
        logLevel: LogLevel.info
      });
    });

    it('throws an exception given no file nether directory', () => {
      expect(() => parser.parseInput({})).toThrow(new NoComponentResolveSpecifiedError());
    });
  });

  describe('parsing resolution mode', () => {
    it('returns the given adapter', () => {
      expect(() => parser.parseInput({ directory: '/my-comps', adapter: 'anything'}))
          .toThrow(new InvalidOption("adapter", "anything"));

      expect(parser.parseInput({ directory: '/my-comps', adapter: 'react'}))
          .toMatchObject({
            adapter: AvailableAdapters.react,
          });

      expect(parser.parseInput({ directory: '/my-comps', adapter: 'vue'}))
          .toMatchObject({
            adapter: AvailableAdapters.vue,
          });

      expect(parser.parseInput({ directory: '/my-comps', adapter: 'vue', configFile: 'my-config.js'}))
          .toMatchObject({
            adapter: AvailableAdapters.vue,
            configFile: path.join(process.cwd(), 'my-config.js')
          });
    });

    it('returns a custom adapter', () => {
      expect(() => parser.parseInput({ directory: '/my-comps', adapter: 'custom'}))
          .toThrow(new RequiredConfigFileForCustomAdapterError());

      expect(parser.parseInput({ directory: '/my-comps', adapter: 'custom', configFile: 'config.js'}))
          .toMatchObject({
            adapter: AvailableAdapters.custom,
          });
    });
  });

  it('returns if ssr is enabled', () => {
    expect(parser.parseInput({ directory: '/my-comps', ssrEnabled: false}))
        .toMatchObject({
          ssrEnabled: false,
        });

    expect(parser.parseInput({ directory: '/my-comps', ssrEnabled: true}))
        .toMatchObject({
          ssrEnabled: true,
        });
  });

  it('returns log info', () => {
    expect(() => parser.parseInput({ directory: '/my-comps', log: 'anything'}))
        .toThrow(new InvalidOption("log", "anything"));

    expect(parser.parseInput({ directory: '/my-comps', log: 'debug'}))
        .toMatchObject({
          logLevel: LogLevel.debug,
        });

    expect(parser.parseInput({ directory: '/my-comps', log: 'info'}))
        .toMatchObject({
          logLevel: LogLevel.info,
        });

    expect(parser.parseInput({ directory: '/my-comps', log: 'warn'}))
        .toMatchObject({
          logLevel: LogLevel.warn,
        });

    expect(parser.parseInput({ directory: '/my-comps', log: 'error'}))
        .toMatchObject({
          logLevel: LogLevel.error,
        });
  });

  describe('basic fields mapping', () => {
    it('maps ssr', () => {
      expect(parser.parseInput({...basicConfig, ssrEnabled: true}).ssrEnabled).toBeTruthy();
      expect(parser.parseInput({...basicConfig, ssrEnabled: false}).ssrEnabled).toBeFalsy();
      expect(parser.parseInput({...basicConfig}).ssrEnabled).toBeFalsy();
    });

    it('maps base url', () => {
      expect(parser.parseInput({...basicConfig, baseurl: '/'}).baseurl).toEqual('/');

      expect(parser.parseInput({...basicConfig, baseurl: 'base/url'}).baseurl)
          .toEqual(path.join(process.cwd(), 'base', 'url'));

      expect(parser.parseInput({...basicConfig}).baseurl).toBeUndefined();
    });

    it('maps dependencies', () => {
      expect(parser.parseInput({...basicConfig}).dependencies).toBeUndefined();
      expect(parser.parseInput({...basicConfig, dependencies: '/deps.json'}).dependencies).toEqual('/deps.json');
      expect(parser.parseInput({...basicConfig, dependencies: 'deps.json'}).dependencies)
          .toEqual(path.join(process.cwd(), 'deps.json'));
    });

    it('returns the port', () => {
      expect(parser.parseInput({...basicConfig, port: '4000'}).port).toEqual(4000);
      expect(parser.parseInput({...basicConfig}).port).toBeUndefined();

      expect(() => parser.parseInput({...basicConfig, port: 'non-number'}))
          .toThrow(new InvalidOption("port", "non-number"));

      expect(() => parser.parseInput({...basicConfig, port: '0'}))
          .toThrow(new InvalidOption("port", "0"));
    });
  });
});
