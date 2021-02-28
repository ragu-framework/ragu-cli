import {ConsoleLogger} from "ragu-server";
import {injectable} from "tsyringe";


@injectable()
export class DetectInstallation {
  constructor(private readonly logger: ConsoleLogger) {}

  isPackageAvailable(packageName: string): boolean {
    try {
      require(packageName);
      this.logger.debug(`The package "${packageName}" was found!`);
      return true;
    } catch {
      this.logger.debug(`The package "${packageName}" could not be found!`);
      return false;
    }
  }
}
