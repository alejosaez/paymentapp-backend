import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart_items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartProducts', 'cartProducts.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, cartProducts: [], total: 0 });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const cart = await this.getCart(userId);

    let cartItem = cart.cartProducts.find(
      (item) => item.product.id === productId,
    );

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * product.price;
    } else {
      cartItem = this.cartItemRepository.create({
        product,
        quantity,
        totalPrice: quantity * product.price,
        cart,
      });
      cart.cartProducts.push(cartItem);
    }

    cart.total = cart.cartProducts.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    await this.cartRepository.save(cart);
    return cart;
  }

  async updateCartItem(
    userId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const { itemId, quantity } = updateCartItemDto;

    const cart = await this.getCart(userId);
    const cartItem = cart.cartProducts.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.quantity * cartItem.product.price;

    cart.total = cart.cartProducts.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    await this.cartRepository.save(cart);
    return cart;
  }

  async removeCartItem(userId: string, itemId: number): Promise<Cart> {
    const cart = await this.getCart(userId);

    const cartItemIndex = cart.cartProducts.findIndex(
      (item) => item.id === itemId,
    );

    if (cartItemIndex === -1) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    cart.cartProducts.splice(cartItemIndex, 1);

    cart.total = cart.cartProducts.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    await this.cartRepository.save(cart);
    return cart;
  }
}
