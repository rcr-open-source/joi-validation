export function createFunctionText(typeName: string, fields: string[]): string {
    const fileText = `
    import * as Joi from "joi";
    import { ${typeName} } from "../${typeName}";
    
    /**
     * Функция валидации полей объекта ${typeName}
     * @param obj аргумент типа ${typeName}
     */
    export function validate${typeName}(obj: ${typeName}): void {
        try {
            const joiObject = {
                ${fields.join(",\n")}
            }
            const schema = Joi.object(joiObject);
            const { error } = schema.validate(obj);
            if (typeof error !== "undefined"){
                const message = error.details.map((el) => el.message);
                throw new Error(message.join(", "));
            }
        } catch (error) {
            throw new Error(\`Ошибка при валидации объекта: \${(error as Error).message}\`)
        }
    }`;
    return fileText;
}