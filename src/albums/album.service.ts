import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Album } from './album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate as uuidValidate } from 'uuid';
import { ArtistService } from '../artists/artist.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly artistService: ArtistService,
    private prisma: PrismaService,
  ) {}

  async getAlbums(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async getAlbum(id: string): Promise<Album> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async createAlbum(albumData: CreateAlbumDto): Promise<Album> {
    const { name, year, artistId } = albumData;
    if (!name || typeof year !== 'number') {
      throw new BadRequestException('Name and year are required');
    }

    if (artistId) {
      try {
        await this.artistService.getArtist(artistId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Artist not found');
        }
        throw error;
      }
    }

    return this.prisma.album.create({
      data: {
        name,
        year,
        artistId: artistId || null,
      },
    });
  }

  async updateAlbum(id: string, albumData: UpdateAlbumDto): Promise<Album> {
    const { name, year, artistId } = albumData;
    if (!name || typeof year !== 'number') {
      throw new BadRequestException('Name and year are required');
    }

    if (artistId) {
      try {
        await this.artistService.getArtist(artistId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Artist not found');
        }
        throw error;
      }
    }

    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          name,
          year,
          artistId: artistId || null,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Album with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    try {
      await this.prisma.album.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Album with ID ${id} not found`);
      }
      throw error;
    }
  }
}
