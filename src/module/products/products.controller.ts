import { Controller, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const { name, description, price, category, stock, imageUrl } =
      createProductDto;


    const newProduct = {
      name,
      description,
      price: parseFloat(price as any), 
      category,
      stock: parseInt(stock as any, 10), 
      imageUrl, 
    };


    const savedProduct = await this.productsService.create(newProduct);

 
    return savedProduct;
  }
}
