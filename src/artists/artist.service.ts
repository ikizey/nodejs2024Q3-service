import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as uuidValidate } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getArtists(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async getArtist(id: string): Promise<Artist> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async createArtist(artistData: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = artistData;
    if (!name || typeof grammy !== 'boolean') {
      throw new BadRequestException('Name and grammy are required');
    }

    return this.prisma.artist.create({
      data: {
        name,
        grammy,
      },
    });
  }

  async updateArtist(id: string, artistData: UpdateArtistDto): Promise<Artist> {
    const { name, grammy } = artistData;
    if (!name || typeof grammy !== 'boolean') {
      throw new BadRequestException('Name and grammy are required');
    }

    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    try {
      return await this.prisma.artist.update({
        where: { id },
        data: { name, grammy },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Artist with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteArtist(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    try {
      await this.prisma.artist.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Artist with ID ${id} not found`);
      }
      throw error;
    }
  }
}
