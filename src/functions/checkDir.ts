import fs from "fs";

export function checkDir(outputDir): void {

    if (!fs.existsSync(outputDir)) {
        try {
            fs.mkdirSync(outputDir);
        } catch (error) {
            throw new Error(`не удалось создать папку: ${(error as Error).message}`);
        }
    }
    
}