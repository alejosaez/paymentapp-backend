import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.sevice';
import { ProductsModule } from 'src/module/products/product.module';
@Module({
  imports: [ProductsModule],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
