import Joi from "joi";
import { Field } from "../types";

export function createJoiObject(fields:Field[] , map: Map<string,Joi.Schema>): Object {
        const joiObject = fields.reduce((prev, curr) => {
        const temp = {[curr.fieldName]: map.get(`${curr.fieldType}${curr.nullable ? "" : "-required"}`)};
        if (prev === {}){
            
            prev = {...temp};
            return prev;
        }
        prev = {...prev, ...temp};
        return prev;
    }, {});

    return joiObject
}