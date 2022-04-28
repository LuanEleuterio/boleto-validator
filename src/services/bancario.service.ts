import { BadRequestException, Injectable } from '@nestjs/common';
import { FormatterHelper } from 'src/helpers/formatter.helper';
const moment = require('moment');

@Injectable()
export class BancarioService {

    private readonly formatterHelper = new FormatterHelper()

    generate(code: string): any {
        let codeSplited = this.splitCode(code)

        if( this.verifyModule10(codeSplited.slice(0,3)) ){
            
            let barCode = this.genBarCode(codeSplited)

            let amount = this.getAmount(codeSplited[4])
            
            let expirationDate = this.getExpirationDate(codeSplited[4])
            
            if(!this.verifyModule11(barCode)) throw new BadRequestException("Código de Barras inválido")

            return {
                barCode: barCode,
                amount: amount,
                expirationDate: expirationDate
            }

        }else throw new BadRequestException("Numeração da linha digitável incorreta!")
    }

    splitCode(code: string): Array<string> {
        let intervalDefinition  = ['0,10', '10,21', '21,32', '32,33', '33,9999']

        return intervalDefinition.map( interval => code.substring( parseInt(interval.split(',')[0]), parseInt(interval.split(',')[1])) )
    }

    verifyModule10(code: Array<string>): any {

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

    verifyModule11(barCode: string): boolean {
        
        let multiplicator = 2
        let acumulator = 0

        let firstPart =  barCode.substring(0, 4)
        let secondPart = barCode.substring(5, barCode.length)
        let barCodePartials = `${firstPart}${secondPart}`

        let dv = parseInt(barCode.substring(4,5))

        barCodePartials = this.formatterHelper.reverseString(barCodePartials)

        barCodePartials.split('').map(code => {
              
            acumulator += parseInt(code) * multiplicator

            multiplicator = multiplicator === 9 ? 2 : multiplicator++
        })

        let newDV = 11 - (acumulator % 11)

        if(newDV === 0 || newDV === 10 || newDV === 11) newDV = 1

        return dv === newDV
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

    getAmount(code: string): string{
        let price = parseInt(code.substring(4,14))
        price = price / 100
        return  price.toFixed(2)
    }

    getExpirationDate(code: string): any{
        let BASE_DATE = '1997-10-07'
        let fatorVenc = parseInt(code.substring(0,4))

        return moment(BASE_DATE).add(fatorVenc, 'days').format('YYYY-MM-DD')
    }

}
