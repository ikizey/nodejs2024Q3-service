import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as uuidValidate } from 'uuid';
import { ArtistService } from '../artists/artist.service';
import { AlbumService } from '../albums/album.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private prisma: PrismaService,
  ) {}

  async getTracks(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async getTrack(id: string): Promise<Track> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  async createTrack(trackData: CreateTrackDto): Promise<Track> {
    const { name, artistId, albumId, duration } = trackData;
    if (!name || typeof duration !== 'number') {
      throw new BadRequestException('Name and duration are required');
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

    if (albumId) {
      try {
        await this.albumService.getAlbum(albumId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Album not found');
        }
        throw error;
      }
    }

    return this.prisma.track.create({
      data: {
        name,
        duration,
        artistId: artistId || null,
        albumId: albumId || null,
      },
    });
  }

  async updateTrack(id: string, trackData: UpdateTrackDto): Promise<Track> {
    const { name, duration, artistId, albumId } = trackData;
    if (!name || typeof duration !== 'number') {
      throw new BadRequestException('Name and duration are required');
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

    if (albumId) {
      try {
        await this.albumService.getAlbum(albumId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Album not found');
        }
        throw error;
      }
    }

    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          name,
          duration,
          artistId: artistId || null,
          albumId: albumId || null,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteTrack(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    try {
      await this.prisma.track.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      throw error;
    }
  }
}
