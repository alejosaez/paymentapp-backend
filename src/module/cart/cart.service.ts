import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

    // Verificar que el producto existe
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Verificar que haya suficiente stock disponible
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${quantity}`,
      );
    }

    // Obtener o crear el carrito
    const cart = await this.getCart(userId);

    // Buscar si el producto ya existe en el carrito
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

    // Reducir el stock del producto
    product.stock -= quantity;
    await this.productRepository.save(product);

    // Actualizar el total del carrito
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

    const product = await this.productRepository.findOneBy({
      id: cartItem.product.id,
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${cartItem.product.id} not found`,
      );
    }

    const quantityDifference = quantity - cartItem.quantity;

    if (quantityDifference > 0 && product.stock < quantityDifference) {
      throw new BadRequestException(
        `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${quantityDifference}`,
      );
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.quantity * product.price;

    product.stock -= quantityDifference;
    await this.productRepository.save(product);

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

    const cartItem = cart.cartProducts[cartItemIndex];
    const product = await this.productRepository.findOneBy({
      id: cartItem.product.id,
    });

    if (product) {
      product.stock += cartItem.quantity;
      await this.productRepository.save(product);
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
