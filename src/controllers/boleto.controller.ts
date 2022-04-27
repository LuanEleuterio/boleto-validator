import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { BoletoService } from '../services/boleto.service';
import { Response } from 'express';

@Controller('boleto')
export class BoletoController {
  constructor(private readonly boletoService: BoletoService) {}

  @Get('/:boletoNumber')
  async generate(@Param('boletoNumber') boletoNumber, @Res() res: Response): Promise<void> {
    try {
        let boleto = await this.boletoService.init(boletoNumber);

        res.status(HttpStatus.OK).json(boleto)
        
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json(error.response)
    }
  }
}
