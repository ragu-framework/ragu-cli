import path from "path";

export const getAbsolutePath = (filename: string) => {
  return path.resolve(process.cwd(), filename);
}

export const removeExtension = (filename: string) => {
  const parsed = path.parse(filename);
  return path.join(parsed.dir, parsed.name);
}
