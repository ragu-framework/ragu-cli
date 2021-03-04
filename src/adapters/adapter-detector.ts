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
  frameworkPackage: string,
  adapterPackage: string,
  adapterName: string,
}

@injectable()
export class AdapterDetector {
  private readonly adapterList: AdapterPackageMap[] = [
    {
      framework: AvailableAdapters.react,
      frameworkPackage: AvailableAdapters.react,
      adapterName: 'ragu-react-server-adapter',
      adapterPackage: 'ragu-react-server-adapter/config'
    },
    {
      framework: AvailableAdapters.vue,
      frameworkPackage: AvailableAdapters.vue,
      adapterName: 'ragu-vue-server-adapter',
      adapterPackage: 'ragu-vue-server-adapter/config'
    },
    {
      framework: AvailableAdapters.simple,
      frameworkPackage: '__no_package_to_check',
      adapterName: 'ragu-simple-adapter',
      adapterPackage: 'ragu-simple-adapter/config'
    }
  ]

  constructor(private readonly consoleLogger: ConsoleLogger, private readonly detectInstallation: DetectInstallation) {
  }

  detectAdaptor(): NonCustomAdapters {
    const adapter = this.adapterList.find((adapter) => {
      return this.detectInstallation.isPackageAvailable(adapter.adapterPackage);
    });

    if (adapter) {
      this.consoleLogger.info(`Framework detected! You are using "${adapter.framework}".`);

      return adapter.framework;
    }

    const framework = this.adapterList.find((adapter) => {
      return this.detectInstallation.isPackageAvailable(adapter.frameworkPackage);
    });

    if (!framework) {
      throw new ImpossibleToDetectAdapter();
    }

    this.consoleLogger.error(`Adapter Not Found! You must install the "${framework.adapterName}" to proceed.`);
    throw new AdapterNotInstallerError(framework.framework);
  }
}
