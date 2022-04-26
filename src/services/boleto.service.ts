import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidatorHelper } from '../helpers/validator.helper';
import { ErrorHandling } from '../core/errorHandling.core'

@Injectable()
export class BoletoService {

    private readonly validatorHelper = new ValidatorHelper()

    init(boleto: any): string {
        console.log(this.validatorHelper.containChar(boleto))

        if(this.validatorHelper.containChar(boleto)) throw new BadRequestException("Boleto contém caracteres não numéricos")
    
        return boleto;
    }
}
