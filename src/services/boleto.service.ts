import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidatorHelper } from '../helpers/validator.helper';
import { ErrorHandling } from '../core/errorHandling.core'
import { BancarioService }  from './bancario.service'

@Injectable()
export class BoletoService {

    private readonly validatorHelper = new ValidatorHelper()
    private readonly bancarioService = new BancarioService()

    init(boleto: any): string {
        console.log(this.validatorHelper.containChar(boleto))

        if(this.validatorHelper.containChar(boleto)) throw new BadRequestException("Boleto contém caracteres não numéricos")
        
        if(boleto.length === 47) return this.bancarioService.generate(boleto)
        else if( boleto.length === 48) console.log("concessionárias")//concessionárias

    }
}


