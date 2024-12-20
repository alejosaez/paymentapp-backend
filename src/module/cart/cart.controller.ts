import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required to fetch the cart');
    }

    return this.cartService.getCart(userId);
  }

  @Post()
  async addToCart(
    @Query('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    if (!userId) {
      throw new BadRequestException(
        'User ID is required to add items to the cart',
      );
    }

    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Patch()
  async updateCartItem(
    @Query('userId') userId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    if (!userId) {
      throw new BadRequestException(
        'User ID is required to update items in the cart',
      );
    }

    return this.cartService.updateCartItem(userId, updateCartItemDto);
  }

  @Delete()
  async removeCartItem(
    @Query('userId') userId: string,
    @Query('itemId') itemId: number,
  ) {
    if (!userId) {
      throw new BadRequestException(
        'User ID is required to remove items from the cart',
      );
    }

    if (!itemId) {
      throw new BadRequestException(
        'Item ID is required to remove items from the cart',
      );
    }

    return this.cartService.removeCartItem(userId, itemId);
  }
}
