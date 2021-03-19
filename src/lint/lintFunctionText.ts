import { ESLint } from "eslint";

export async function lintFunctionText(functionText: string) :Promise<string> {

    try {

        const eslint: ESLint = new ESLint({
            fix: true, 
            useEslintrc: true
        });
        const messages = await eslint.lintText(functionText);
        const [result] =  messages.map((result) => {
                if(result.output){

                    return result.output;

                } else {

                    throw new Error(`lint error`);

                }
            });
        if (typeof result === "undefined"){

            throw new Error(`result is undefined`); 
            
        }
        return result;

    } catch (error) {

        throw error;

    }
}
