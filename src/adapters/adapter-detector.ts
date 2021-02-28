import {injectable} from "tsyringe";
import {ConsoleLogger} from "ragu-server";
import {DetectInstallation} from "./detect-installation";
import {AvailableAdapters} from "./available-adapters";

export class AdapterNotInstallerError extends Error {
  constructor(public readonly adapter: AvailableAdapters) {
    super("Adapter not installed!");
  }
}

@injectable()
export class AdapterDetector {
  private readonly adapterList = [
    {
      framework: AvailableAdapters.react,
      adapterPackage: 'ragu-react-server-adapter'
    },
    {
      framework: AvailableAdapters.vue,
      adapterPackage: 'ragu-vue-server-adapter'
    }
  ]

  constructor(private readonly consoleLogger: ConsoleLogger, private readonly detectInstallation: DetectInstallation) {
  }

  detectAdaptor(): AvailableAdapters | null {
    const adapter = this.adapterList.find((adapter) => {
      return this.detectInstallation.isPackageAvailable(adapter.framework);
    });

    if (adapter) {
      this.consoleLogger.info(`Framework detected! You are using "${adapter.framework}".`);

      if (!this.detectInstallation.isPackageAvailable(adapter.adapterPackage)) {
        this.consoleLogger.error(`Adapter Not Found! You must install the "${adapter.adapterPackage}" to proceed.`);
        throw new AdapterNotInstallerError(adapter.framework);
      }

      return adapter.framework;
    }

    return null;
  }
}
