import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
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

@Get()
async getAllProducts() {
  return await this.productsService.findAll();
}


@Get(':id')
async getProductById(@Param('id') id: number) {
  return await this.productsService.findOne(id);
}
@Delete(':id')
async deleteProduct(@Param('id') id: number) {
  await this.productsService.delete(id);
  return { message: `Product with ID ${id} deleted successfully` };
}
}