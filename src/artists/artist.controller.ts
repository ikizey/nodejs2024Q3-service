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
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistService } from './artist.service';
import { Artist } from './artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getArtists(): Promise<Artist[]> {
    return this.artistService.getArtists();
  }

  @Get(':id')
  async getArtist(@Param('id') id: string): Promise<Artist> {
    return this.artistService.getArtist(id);
  }

  @Post()
  async createArtist(@Body() artistData: CreateArtistDto): Promise<Artist> {
    return this.artistService.createArtist(artistData);
  }

  @Put(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() artistData: UpdateArtistDto,
  ): Promise<Artist> {
    return this.artistService.updateArtist(id, artistData);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id') id: string): Promise<void> {
    this.artistService.deleteArtist(id);
  }
}
