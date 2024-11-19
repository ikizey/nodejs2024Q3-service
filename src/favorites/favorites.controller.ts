import { Controller, Get, Post, Delete, Param, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './favorites.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(): Promise<FavoritesResponse> {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrack(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtist(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeArtist(id);
  }
}
