import { join, relative } from "path";
import { fs } from "mz";
import installDependencies from "../dependencies/install-dependencies";

export default async function findPackageMeta(
  dependency: {
    name: string;
    version: string;
  },
  rootPath: string,
): Promise<Record<string, boolean>> {
  let result: Record<string, boolean> = {};
  const pkgPath = join(rootPath, "node_modules", dependency.name);

  const traverseDirectory = (currentPath: string) => {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const itemPath = join(currentPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        traverseDirectory(itemPath);
      } else if (stats.isFile()) {
        const relativePath = relative(pkgPath, itemPath);
        result[relativePath] = true;
      }
    });
  };

  if (fs.existsSync(pkgPath)) {
    traverseDirectory(pkgPath);
  } else {
    await installDependencies(dependency, rootPath);
    traverseDirectory(pkgPath);
  }
  return result;
}
