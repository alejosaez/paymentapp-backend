import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ProductsService } from 'src/module/products/products.service';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private readonly productsService: ProductsService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getChatResponse(userInput: string, userName: string): Promise<string> {
    const products = await this.productsService.findAll();

    const productList = products
      .map(
        (p) =>
          `- ${p.name}: ${p.description}. Precio: $${p.price}. Stock: ${p.stock} unidades.`,
      )
      .join('\n');

    const prompt = `
    Eres un asistente virtual para un e-commerce de productos deportivos. 
    Actualmente estás ayudando a ${userName}.

    El inventario actual es el siguiente:
    ${productList}

    Si el usuario te pregunta por algún producto específico (por ejemplo, proteínas, zapatillas, balones, etc.), busca coincidencias en los nombres y descripciones de los productos disponibles.
    Si un producto coincide con lo que busca, responde sus características, precio y stock.
    Si no hay coincidencias, responde que no hay productos relacionados con esa búsqueda.

    El usuario dice: "${userInput}"
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userInput },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  }
}
