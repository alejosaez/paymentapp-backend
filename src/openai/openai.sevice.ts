import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ProductsService } from 'src/module/products/products.service';

@Injectable()
export class OpenaiService {
  constructor(private readonly productsService: ProductsService) {}

  async getChatResponse(userInput: string, userName: string): Promise<string> {
    const products = await this.productsService.findAll();

    const payload = {
      message: userInput,
      userName: userName || 'Usuario',
      products: products.map((p) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: p.imageUrl,
      })),
    };

    try {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
      const response = await axios.post(n8nWebhookUrl, payload, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.response || 'No se pudo generar una respuesta.';
    } catch (error) {
      console.error('Error al enviar los datos a n8n:', error.message);
      return 'Hubo un error al procesar tu solicitud. Intenta nuevamente.';
    }
  }
}
