import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumService } from './album.service';
import { Album } from './album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAlbums(): Promise<Album[]> {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  async getAlbum(@Param('id') id: string): Promise<Album> {
    return this.albumService.getAlbum(id);
  }

  @Post()
  async createAlbum(@Body() albumData: CreateAlbumDto): Promise<Album> {
    return this.albumService.createAlbum(albumData);
  }

  @Put(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() albumData: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumService.updateAlbum(id, albumData);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Param('id') id: string): Promise<void> {
    this.albumService.deleteAlbum(id);
  }
}
