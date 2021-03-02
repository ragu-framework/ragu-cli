import {container} from "tsyringe";
import {AdapterNotInstallerError, AdapterDetector, ImpossibleToDetectAdapter} from "./adapter-detector";
import {DetectInstallation} from "./detect-installation";
import {ConsoleLogger} from "ragu-server";
import {AvailableAdapters} from "./available-adapters";

class DetectInstallationStub extends DetectInstallation {
  constructor(private readonly installedPackages: string[]) {
    super(container.resolve(ConsoleLogger));
  }

  isPackageAvailable(packageName: string): boolean {
    return this.installedPackages
        .some((installedPackage: string) => installedPackage === packageName);
  }
}

describe('AdapterDetector', () => {
  describe('when using react', () => {
    it('returns react given react and ragu-react-server-adapter is installed', () => {
      const logger = container.resolve(ConsoleLogger);
      container.registerInstance(DetectInstallation, new DetectInstallationStub(['react', 'ragu-react-server-adapter/config']));
      const adaptorDetector = container.resolve(AdapterDetector);

      expect(adaptorDetector.detectAdaptor()).toEqual(AvailableAdapters.react);
      expect(logger.info).toBeCalledWith('Framework detected! You are using "react".');
    });

    it('throws an exception given the adapter is not installed', () => {
      const logger = container.resolve(ConsoleLogger);
      container.registerInstance(DetectInstallation, new DetectInstallationStub(['react']));
      const adaptorDetector = container.resolve(AdapterDetector);

      expect(() => adaptorDetector.detectAdaptor()).toThrow(new AdapterNotInstallerError(AvailableAdapters.react));
      expect(logger.error).toBeCalledWith('Adapter Not Found! You must install the "ragu-react-server-adapter" to proceed.');
    });
  });

  describe('when using vue', () => {
    it('returns vue given vue and ragu-vue-server-adapter is installed', () => {
      const logger = container.resolve(ConsoleLogger);
      container.registerInstance(DetectInstallation, new DetectInstallationStub(['vue', 'ragu-vue-server-adapter/config']));
      const adaptorDetector = container.resolve(AdapterDetector);

      expect(adaptorDetector.detectAdaptor()).toEqual(AvailableAdapters.vue);
      expect(logger.info).toBeCalledWith('Framework detected! You are using "vue".');
    });

    it('throws an exception given the adapter is not installed', () => {
      const logger = container.resolve(ConsoleLogger);
      container.registerInstance(DetectInstallation, new DetectInstallationStub(['vue']));
      const adaptorDetector = container.resolve(AdapterDetector);

      expect(() => adaptorDetector.detectAdaptor()).toThrow(new AdapterNotInstallerError(AvailableAdapters.vue));
      expect(logger.error).toBeCalledWith('Adapter Not Found! You must install the "ragu-vue-server-adapter" to proceed.');
    });
  });

  describe('when using nothing', () => {
    it('throws an error', () => {
      container.registerInstance(DetectInstallation, new DetectInstallationStub([]));

      const adaptorDetector = container.resolve(AdapterDetector);

      expect(() => adaptorDetector.detectAdaptor()).toThrow(new ImpossibleToDetectAdapter());
    });
  })
});
