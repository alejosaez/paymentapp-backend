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
    // Obtén todos los productos
    const products = await this.productsService.findAll();

    // Construye el listado de productos
    const productList = products
      .map(
        (p) =>
          `- ${p.name}: ${p.description}. Precio: $${p.price.toFixed(
            2,
          )}. Stock: ${p.stock} unidades.`,
      )
      .join('\n');

    // Prompt optimizado
    const prompt = `
    Eres un asistente virtual para un e-commerce especializado en productos deportivos.
    Tu objetivo es ayudar a los usuarios proporcionando información sobre los productos disponibles.

    Actualmente estás ayudando a ${userName}.
    Aquí está el inventario actual de productos:
    ${productList}

    Instrucciones:
    1. Si el usuario pregunta por un producto específico, busca coincidencias en los nombres o descripciones.
    2. Si hay coincidencias, responde con los detalles del producto (nombre, descripción, precio y stock).
    3. Si no hay coincidencias, informa al usuario que no se encontraron productos relacionados.
    4. Si el usuario realiza preguntas generales (por ejemplo, productos en stock), responde con una lista adecuada.

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
