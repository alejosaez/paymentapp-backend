import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './module/users/users.module';
import { ProductsModule } from './module/products/product.module';
import { CartModule } from './module/cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OpenaiModule } from './openai/openai.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'paymentapp.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
    CartModule,
    AuthModule,
    OpenaiModule,
  ],
})
export class AppModule {}
