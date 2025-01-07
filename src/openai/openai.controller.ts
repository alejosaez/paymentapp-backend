import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.sevice';
import axios from 'axios';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat')
  async getResponse(@Body() body: { message: string; userName: string }) {
    const { message, userName } = body;

    if (!message || !message.trim()) {
      return { response: 'Por favor, ingresa un mensaje válido.' };
    }

    try {
      const chatbotResponse = await this.openaiService.getChatResponse(
        message,
        userName || 'Usuario',
      );

      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
      if (n8nWebhookUrl) {
        await axios.post(n8nWebhookUrl, {
          message,
          userName: userName || 'Usuario',
          response: chatbotResponse,
        });
      }

      return { response: chatbotResponse };
    } catch (error) {
      console.error('Error al procesar la solicitud:', error.message);
      return {
        response: 'Hubo un error al procesar tu solicitud. Intenta nuevamente.',
      };
    }
  }
}
