import { join } from "path";

import { fs } from "mz";
import installDependencies from "../dependencies/install-dependencies";

export default async function findPackageFile(
  dependency: {
    name: string;
    version: string;
  },
  rootPath: string,
  fileName: string,
): Promise<string> {
  let res = "";
  const pkgPath = join(rootPath, "node_modules", dependency.name, fileName);
  if (fs.existsSync(pkgPath)) {
    res = (await fs.readFile(pkgPath)).toString();
  } else {
    await installDependencies(dependency, rootPath);
    res = (await fs.readFile(pkgPath)).toString();
  }
  return res;
}
