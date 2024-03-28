import { Body, Controller, Post, Get, Param, Redirect, NotFoundException, Put, Query} from '@nestjs/common';
import { LinkService } from './link.service';

@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  async createLink(@Body() body: { url: string, password?: string, expirationDate?: Date }) { //El signo de pregunta indica que el parametro es opcional
    const { url,password,expirationDate } = body; //Esto es lo que ingresa en el body
    const maskedLink = await this.linkService.createLink(url, password, expirationDate);//Ya se entiende que estas variables son del objeto body
    return { maskedLink };
  }

  @Get(':maskKey')
  @Redirect('', 302)
  async redirectToOriginalUrl(@Param('maskKey') maskKey: string,@Query('password') password: string) {
    const originalUrl = await this.linkService.getOriginalUrlByMaskKey(maskKey,password);
    if (!originalUrl) {
      throw new NotFoundException(); // Si no se encuentra el enlace, lanzar una excepción NotFoundException
    }
    return { url: originalUrl };
  }

  @Get(':id/stats')
  async getLinkStats(@Param('id') maskKey: string) {
    const stats = await this.linkService.getLinkStats(maskKey);
    return { stats };
  }

  @Put(':id/invalidate')
  async invalidateLink(@Param('id') maskKey: string) {
    const success = await this.linkService.invalidateLink(maskKey);
    if (!success) {
      throw new NotFoundException('Link not found');
    }
    return { message: 'Link invalidated successfully' };
  }
}
