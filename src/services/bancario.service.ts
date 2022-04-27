import { BadRequestException, Injectable } from '@nestjs/common';
import { FormatterHelper } from 'src/helpers/formatter.helper';

@Injectable()
export class BancarioService {

    private readonly formatterHelper = new FormatterHelper()

    generate(code: string): any {
        let codeSplited = this.splitCode(code)
        
        console.log(codeSplited)

        if( this.verifyModule10(codeSplited.slice(0,3)) ){
            
            let barCode = this.genBarCode(codeSplited)
            
            //TODO get amount

            //TODO get expirationDate

            return {
                barCode: barCode,
                amount: "",
                expirationDate: "" 
            }

        }else throw new BadRequestException("Numeração do boleto incorreta!")
    }

    splitCode(code: string): Array<string> {
        let intervalDefinition  = ['0,10', '10,21', '21,32', '32,33', '33,9999']

        return intervalDefinition.map( interval => code.substring( parseInt(interval.split(',')[0]), parseInt(interval.split(',')[1])) )
    }

    verifyModule10(code: Array<string>): any{

        let allDigitsOK = true
        
        code.map(code => {
            let codeDV = parseInt(code.substring(code.length - 1))
            let multiplicator = 2
            let acumulator = 0
            let newCode = ''

            code = code.substring(0, code.length - 1)

            let codeReverted = this.formatterHelper.reverseString(code)
            
            codeReverted.split("").map(code => {

                let number = parseInt(code) * multiplicator
                
                if(number > 9) number = this.reduceNumber(number)

                acumulator += number

                multiplicator = multiplicator === 2 ? 1 : 2
            })

            let restDiv = acumulator % 10
            
            let newDV = this.genDigitVerificator(acumulator, restDiv)

            if(newDV !== codeDV) allDigitsOK = false
        })

        return allDigitsOK
    }   

    reduceNumber(number: number): number {

        let newNumber: any
        for(;;){        
            let numberSplited = number.toString().split("")

            newNumber = parseInt(numberSplited[0]) + parseInt(numberSplited[1])

            if(newNumber > 9) {
                newNumber = newNumber.toString()
                continue
            }
            break
        }

        return newNumber
    }

    genDigitVerificator(acumulator: number, restDiv: number): number{
        
        let nextDezena = Math.ceil(acumulator / 10) * 10

        let dv = (nextDezena - restDiv).toString()
        return parseInt(dv.split('')[1])
    }

    genBarCode(code: Array<string>){
        let barCode = ''

        //CAMPO 1
        barCode += code[0].substring(0, 4)
        //CAMPO 4
        barCode += code[3]
        //CAMPO 5
        barCode += code[4]
        //CAMPO 1
        barCode += code[0].substring(4, 9)
        //CAMPO 2
        barCode += code[1].substring(0, 10)
        //CAMPO 3
        barCode += code[2].substring(0, 10)

        return barCode
    }

}
