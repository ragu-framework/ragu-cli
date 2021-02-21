import {ConsoleLogger} from "ragu-server";

const isLibraryInstalled = (libName: string) => {
  try {
    require(libName);
    return true;
  } catch {
    return false;
  }
}

const log = new ConsoleLogger();

export type SupportedFrameworks = 'react' | 'vue' | 'custom';

export const detectFramework = (): SupportedFrameworks | null => {
  if (isLibraryInstalled('react')) {
    log.info("Framework Detected! You are using React.");

    if (isLibraryInstalled('ragu-react-server-adapter/config')) {
      return 'react';
    }

    log.error('you must install "ragu-react-server-adapter".')
  }

  return null;
}
