import { exec } from "child_process";
import * as npa from "npm-package-arg";
import { join } from "path";

export default function installDependencies(
  dependency: { name: string; version: string },
  packagePath: string,
) {
  return new Promise<void>((resolve, reject) => {
    const depString = `${dependency.name}@${dependency.version}`;
    if(dependency.version === 'favicon.ico') resolve()
    const spec = npa(depString);

    // TODO 添加私有npm库 --registry=http://xxx.com  (root权限较好 全局yarn较好)
    const cmdcmd = `mkdir -p ${packagePath} && cd ${packagePath} && yarn add ${depString} ${
      spec.type === "git" ? "" : "--ignore-scripts"
    } --no-lockfile --non-interactive --no-bin-links --ignore-engines --skip-integrity-check --cache-folder ./`

    exec(
      cmdcmd,
      (err, stdout, stderr) => {
        if (err) {
          console.warn("got error from install: " + err);
          reject(
            err.message.indexOf("versions") >= 0
              ? new Error("INVALID_VERSION")
              : err,
          );
        } else {
          resolve();
        }
      },
    );
  });
}
