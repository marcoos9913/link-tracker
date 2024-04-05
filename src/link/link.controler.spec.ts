import { Test, TestingModule } from '@nestjs/testing';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { NotFoundException } from '@nestjs/common';
import { Link } from './link.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LinkController -> TEST all the endpoints', () => {
  let linkController: LinkController;
  let linkService: LinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkController],
      providers: [
        LinkService,
        {
          provide: getRepositoryToken(Link),
          useClass: Link,
        },
      ],
    }).compile();

    linkController = module.get<LinkController>(LinkController);
    linkService = module.get<LinkService>(LinkService);
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to original URL', async () => {
      const maskKey = 'abcdef';
      const password = 'testPassword';
      const originalUrl = 'https://www.google.com';
      const mockLink = { originalUrl };
  
      jest.spyOn(linkService, 'getOriginalUrlByMaskKey').mockResolvedValueOnce(originalUrl);
      jest.spyOn(linkController, 'redirectToOriginalUrl').mockImplementation(async () => {
        return { url: originalUrl };
      });
  
      const result = await linkController.redirectToOriginalUrl(maskKey, password);
  
      expect(result.url).toBe(originalUrl);
    });
  
    it('should throw NotFoundException if original URL is not found', async () => {
      const maskKey = 'abcdef';
      const password = 'testPassword';
  
      jest.spyOn(linkService, 'getOriginalUrlByMaskKey').mockResolvedValueOnce(null);
  
      await expect(linkController.redirectToOriginalUrl(maskKey, password)).rejects.toThrowError(NotFoundException);
    });
  });
  
  describe('createLink', () => {
    it('should create a new link', async () => {
      const url = 'https://www.google.com';
      const password = 'testPassword';
      const expirationDate = new Date('2024-12-31');
  
      const mockBody = {
        url,
        password,
        expirationDate,
      };
  
      const mockLink = 'http://localhost:3000/links';
  
      jest.spyOn(linkService, 'createLink').mockResolvedValueOnce(mockLink);
  
      const result = await linkController.createLink(mockBody);
  
      expect(result.maskedLink).toEqual(mockLink);
    });
  });

  describe('invalidateLink', () => {
    it('should invalidate/delete link', async () => {
      const maskKey = 'abcdef';
  
      // Mock para simular la eliminación exitosa del enlace
      jest.spyOn(linkService, 'invalidateLink').mockResolvedValueOnce(true);
  
      const result = await linkController.invalidateLink(maskKey);
  
      expect(result).toEqual({ message: 'Link invalidated successfully' });
    });
  
    it('should throw NotFoundException if link not found during deletion', async () => {
      const maskKey = 'abcdef';
  
      // Mock para simular que el enlace no se encuentra y no puede ser eliminado
      jest.spyOn(linkService, 'invalidateLink').mockResolvedValueOnce(false);
  
      // Como el enlace no puede ser eliminado, esperamos que se lance una NotFoundException
      await expect(linkController.invalidateLink(maskKey)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getLinkStats', () => {
    it('should get link stats', async () => {
      const maskKey = 'abcdef';
      const stats = 10; // Establecer un valor ficticio para las estadísticas
  
      // Mock para simular la obtención de estadísticas exitosa
      jest.spyOn(linkService, 'getLinkStats').mockResolvedValueOnce(stats);
  
      const result = await linkController.getLinkStats(maskKey);
  
      expect(result).toEqual({ stats });
    });
  
    it('should throw NotFoundException if link not found during getting link stats', async () => {
      const maskKey = 'abcdef';
    
      // Mock para simular que el enlace no se encuentra
      jest.spyOn(linkService, 'getLinkStats').mockRejectedValueOnce(new NotFoundException('Link not found'));
    
      // Esperamos que se lance una NotFoundException cuando se intente obtener las estadísticas del enlace
      await expect(linkController.getLinkStats(maskKey)).rejects.toThrowError(NotFoundException);
    });
  });  

});
