import * as fs from "fs";
import path from "path";
import { createInterface } from "readline";
import { checkDir, checkRow, createFunctionText, createJoiFields, getFiles, writeFile } from "./functions";
import { lintFunctionText } from "./lint";
import { Field } from "./types";

const accessModifiers = ["private", "protected", "default", "public", ""];
const types = ["string", "number", "boolean", "Date"];
export async function generateJoiValidators(dir: string) {
    const files = getFiles(dir);
    const outputDir = `${dir}/validate${path.basename(dir)}`;
    checkDir(outputDir);
    const p = path.join(outputDir, "index.ts");
    fs.openSync(p, "w");
    files.map(async(el) => {
        const fileName = el.name;
        const typeName = el.name.substring(0,el.name.lastIndexOf("."));
        const filePath = `${dir}/${fileName}`;
        const fields: Field[] = [];
        const rs = fs.createReadStream(filePath, { flags: "rs+" });
        const iFace = createInterface({ input: rs });
        let [startFunction, endFunction]: number[] = [0,0];
        iFace.on("line", async (line: string) => {
            const row = line.trim();
            const regExpFunc = /[()]+/gm;
            const tempFunc = row.match(regExpFunc);
            if (tempFunc && tempFunc.length > 0){
                const [prevStart, prevEnd] = checkRow(tempFunc, ["(", ")"]);
                startFunction = startFunction + prevStart.length;
                endFunction = endFunction + prevEnd.length;
            }
            const regExp = /[a-zA-Z(){}@]+/gm;
            const matchedArray = row.match(regExp);
            if (matchedArray && matchedArray.length > 0){
                const [accessModifierTemp, fieldNameTemp, fieldTypeTemp, nullableTemp] = matchedArray;
                let testFields = [accessModifierTemp, fieldNameTemp, fieldTypeTemp, nullableTemp];
                if (startFunction === endFunction) {
                    [startFunction, endFunction] = [0,0];
                    if (!accessModifiers.includes(accessModifierTemp)){
                        const temp = types.find((val) => val === fieldNameTemp);
                        if (temp){
                            testFields = ["", accessModifierTemp, fieldNameTemp];
                        }
                    }
                    const [accessModifier, fieldName, fieldType, nullable] = testFields;
                    if (accessModifiers.includes(accessModifier)
                        && types.includes(fieldType)){

                        const field: Field = {
                            accessModifier: accessModifier,
                            fieldName,
                            fieldType: fieldType.toLowerCase(),
                            nullable: typeof nullable === "undefined" ? false : true,
                        }
                        fields.push(field);
                    }
                }
            }
        });
        iFace.on("close", async () => {

            const classFelds: string[] = createJoiFields(fields);

            const setFields = Array.from(new Set([...classFelds]));

            if (setFields.length > 0){
                
                const functionText = createFunctionText(typeName, setFields);
                
                const lintedFunctionText = await lintFunctionText(functionText);

                const str = `validate${typeName}`;
                
                writeFile(outputDir, str, lintedFunctionText);

                const s = `export * from "./${str}";\n`;
                fs.appendFileSync(p, s);

            }

        });

    });

}