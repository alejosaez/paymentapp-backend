import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.sevice';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat')
  async getResponse(@Body() body: { message: string; userName: string }) {
    const { message, userName } = body;

    const response = await this.openaiService.getChatResponse(
      message,
      userName || 'Usuario',
    );
    return { response };
  }
}
