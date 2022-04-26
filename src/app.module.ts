import { Module } from '@nestjs/common';
import { BoletoController } from './controllers/boleto.controller';
import { BoletoService } from './services/boleto.service';

@Module({
  imports: [],
  controllers: [BoletoController],
  providers: [BoletoService],
})
export class AppModule {}
