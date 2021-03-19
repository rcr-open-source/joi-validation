import path from "path";
import fs from "fs";

export function writeFile(outputDir: string, typeName: string, functionText: string ) :void {

    try {
        
        const p = path.join(outputDir, `${typeName}.ts`);

        if (fs.existsSync(p)){
            try {
                fs.unlinkSync(p);
            } catch(error) {
                throw new Error(`не удалось удалить файл: ${(error as Error).message}`)
            }
        }
        fs.appendFileSync(p, functionText);

    } catch (error) {
        
        throw new Error(`Ошибка в writeFile:${(error as Error).message}`);

    }
}