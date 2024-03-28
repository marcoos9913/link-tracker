import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, Repository } from 'typeorm';
import { Link } from './link.entity';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async createLink(originalUrl: string, password: string, expirationDate: Date): Promise<string> {
    // Generar una clave aleatoria para el enlace enmascarado
    const maskKey = this.generateMaskKey();

    // Crear el enlace enmascarado con la URL original y la clave
    const maskedLink = `http://localhost:3000/links/${maskKey}`;

    // Guardar el enlace en la base de datos
    await this.linkRepository.save({ originalUrl, maskedLink, maskKey, password, expirationDate });

    return maskedLink;
  }

  private generateMaskKey(): string {
    // Implementación de generación de clave aleatoria
    // Esta implementación es solo un ejemplo, debes usar una lógica adecuada para generar claves seguras
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;
    let maskKey = '';
    for (let i = 0; i < length; i++) {
      maskKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return maskKey;
  }

  async getOriginalUrlByMaskKey(maskKey: string, password: string): Promise<string | null> {
    const link = await this.linkRepository.findOne({ where: { maskKey, password} });
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    if (link.expirationDate && new Date(link.expirationDate) < new Date()) {
      throw new NotFoundException('Link expired');
    }

    // Incrementar el contador de redirecciones y guardar en la base de datos
    link.redirectCount += 1;
    await this.linkRepository.save(link);

    return link.originalUrl;
  }

  async getLinkStats(maskKey: string): Promise<number> {
    const link = await this.linkRepository.findOne({ where: { maskKey } });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link.redirectCount;
  }

  async invalidateLink(maskKey: string): Promise<boolean> {
    const link = await this.linkRepository.findOne({ where: { maskKey } });

    if (!link) {
      return false;
    }

    await this.linkRepository.delete(link.id);
    return true;
  }

}
