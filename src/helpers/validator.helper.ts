import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidatorHelper {

    containChar(str: string): boolean{
        let regex = /[a-zA-Z]/g

        return regex.test(str)
    }
}
