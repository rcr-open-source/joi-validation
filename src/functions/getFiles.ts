import * as fs from "fs";

export function getFiles(dir: string) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const res = files
        .filter((file) => file.isFile() && file.name.endsWith(".ts") 
                                        && !file.name.endsWith(".test.ts") 
                                        && file.name !== "index.ts")
        .map((file) => {
            return file
        });
        return res;
}