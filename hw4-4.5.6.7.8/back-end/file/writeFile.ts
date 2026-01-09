import { promises as fs } from "node:fs";

const writeFile = async (filename: string, data: any) => {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to write to file", e);
  }
};

export default writeFile;
