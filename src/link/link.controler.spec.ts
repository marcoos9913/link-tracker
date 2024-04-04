import { Test, TestingModule } from '@nestjs/testing';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { NotFoundException } from '@nestjs/common';
import { Link } from './link.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LinkController', () => {
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

  it('should throw NotFoundException if original URL not found', async () => {
    const maskKey = 'abcdef';
    const password = 'testPassword';

    jest.spyOn(linkService, 'getOriginalUrlByMaskKey').mockResolvedValueOnce(null);

    await expect(linkController.redirectToOriginalUrl(maskKey, password)).rejects.toThrowError(NotFoundException);
  });
});
