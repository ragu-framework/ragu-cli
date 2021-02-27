import {DetectInstallation} from "./detect-installation";
import {container} from "tsyringe";
import {ConsoleLogger} from "ragu-server";

describe('DetectInstallation', () => {
  it('returns true given a installed package', () => {
    const instance = container.resolve(DetectInstallation);

    expect(instance.isPackageInstalled('ragu-server')).toBeTruthy();
    expect(instance.isPackageInstalled('zucchini-package')).toBeFalsy();
  });

  it('logs if the instance was found', () => {
    const logger = container.resolve(ConsoleLogger);
    const instance = container.resolve(DetectInstallation);

    instance.isPackageInstalled('ragu-server');
    expect(logger.debug).toBeCalledWith('The package "ragu-server" was found!');

    instance.isPackageInstalled('zucchini-package');
    expect(logger.debug).toBeCalledWith('The package "zucchini-package" could not be found!');
  });
});
