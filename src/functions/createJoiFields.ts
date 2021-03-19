import Joi from "joi";
import { Field } from "../types";

export function createJoiFields(fields:Field[]): string[] {
    try {
        
        return fields.map((field) => {
            const requiredJoiOption = `${field.nullable ? "" : ".required()"}`;
            switch (field.fieldType) {
                case 'string':
                return `${field.fieldName}: Joi.string()${requiredJoiOption}`;
                case 'date':
                return `${field.fieldName}: Joi.date().timestamp()${requiredJoiOption}`;
                case 'boolean':
                return `${field.fieldName}: Joi.boolean()${requiredJoiOption}`;
                case 'number':
                return `${field.fieldName}: Joi.number()${requiredJoiOption}`;
    
                default: throw new Error(`Не определен тип: ${field.fieldType}`);
            }
        });

    } catch (error) {
        
        throw new Error(`Error in createJoiFields: ${(error as Error).message}`);
    }
}