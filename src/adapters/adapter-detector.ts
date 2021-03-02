import {injectable} from "tsyringe";
import {ConsoleLogger} from "ragu-server";
import {DetectInstallation} from "./detect-installation";
import {AvailableAdapters, NonCustomAdapters} from "./available-adapters";

export class AdapterNotInstallerError extends Error {
  constructor(public readonly adapter: AvailableAdapters) {
    super("Adapter not installed!");
  }
}

export class ImpossibleToDetectAdapter extends Error {
  constructor() {
    super("It was not possible do infer the adapter. Define one to proceed.");
  }
}

interface AdapterPackageMap {
  framework: NonCustomAdapters,
  adapterPackage: string,
  adapterName: string
}

@injectable()
export class AdapterDetector {
  private readonly adapterList: AdapterPackageMap[] = [
    {
      framework: AvailableAdapters.react,
      adapterName: 'ragu-react-server-adapter',
      adapterPackage: 'ragu-react-server-adapter/config'
    },
    {
      framework: AvailableAdapters.vue,
      adapterName: 'ragu-vue-server-adapter',
      adapterPackage: 'ragu-vue-server-adapter/config'
    }
  ]

  constructor(private readonly consoleLogger: ConsoleLogger, private readonly detectInstallation: DetectInstallation) {
  }

  detectAdaptor(): NonCustomAdapters {
    const adapter = this.adapterList.find((adapter) => {
      return this.detectInstallation.isPackageAvailable(adapter.framework);
    });

    if (adapter) {
      this.consoleLogger.info(`Framework detected! You are using "${adapter.framework}".`);

      if (!this.detectInstallation.isPackageAvailable(adapter.adapterPackage)) {
        this.consoleLogger.error(`Adapter Not Found! You must install the "${adapter.adapterName}" to proceed.`);
        throw new AdapterNotInstallerError(adapter.framework);
      }

      return adapter.framework;
    }

    throw new ImpossibleToDetectAdapter()
  }
}
