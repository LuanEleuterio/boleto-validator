import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatterHelper {

    reverseString(str: string): string { 
        return str.split('').reverse().join('')
    }
}
