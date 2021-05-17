export function createFunctionText(typeName: string, fields: string[]): string {
    const fileText = `
    import * as Joi from "joi";
    import { ValidationError } from 'joi';
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
            const { error } = schema.validate(obj, {allowUnknown: true, stripUnknown: true});
            if (typeof error !== "undefined"){

                throw new ValidationError(\`Ошибка при валидации объекта ${typeName}: \${error.message}\`, error.details, error._original);

            }
        } catch (error) {

            throw error;

        }
    }`;
    return fileText;
}