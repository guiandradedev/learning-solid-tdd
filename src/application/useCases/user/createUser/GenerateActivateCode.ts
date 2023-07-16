export enum TypeCode {
    string,
    number
}

type GenerateActivateCodeRequest = {
    type: TypeCode,
    size: number,
}

export class GenerateActivateCode {
    execute({ type, size }: GenerateActivateCodeRequest): string | number {
        switch (type) {
            case TypeCode.string: {
                let code = ""
                for(let i=0; i<size; i++) {
                    code += String.fromCharCode(65+Math.floor(Math.random() * 26));
                }
                return code
            }
            case TypeCode.number: {
                let number = ""
                for(let i=0; i<size; i++) {
                    number += Math.floor(Math.random() * 9);
                }

                return Number(number)
            }
            default: {
                let code = Math.random().toString(36).substring(-size).toUpperCase();
                return code
            }
        }
    }
}