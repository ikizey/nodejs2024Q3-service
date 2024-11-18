import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { FavoritesResponse } from './favorites.entity';
import { validate as uuidValidate } from 'uuid';
import { ArtistService } from '../artists/artist.service';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private prisma: PrismaService,
  ) {}

  private async getOrCreateFavorites() {
    let favorites = await this.prisma.favorites.findFirst();
    if (!favorites) {
      favorites = await this.prisma.favorites.create({
        data: {},
      });
    }
    return favorites;
  }

  async getFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.getOrCreateFavorites();

    const [artists, albums, tracks] = await Promise.all([
      this.prisma.artist.findMany({
        where: {
          favorites: {
            some: {
              id: favorites.id,
            },
          },
        },
      }),
      this.prisma.album.findMany({
        where: {
          favorites: {
            some: {
              id: favorites.id,
            },
          },
        },
      }),
      this.prisma.track.findMany({
        where: {
          favorites: {
            some: {
              id: favorites.id,
            },
          },
        },
      }),
    ]);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addTrack(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    try {
      await this.trackService.getTrack(id);
    } catch {
      throw new UnprocessableEntityException('Track does not exist');
    }

    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: {
          connect: { id },
        },
      },
    });
  }

  async removeTrack(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const favorites = await this.getOrCreateFavorites();

    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: {
            disconnect: { id },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Track not found in favorites');
    }
  }

  async addAlbum(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    try {
      await this.albumService.getAlbum(id);
    } catch {
      throw new UnprocessableEntityException('Album does not exist');
    }

    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: {
          connect: { id },
        },
      },
    });
  }

  async removeAlbum(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    const favorites = await this.getOrCreateFavorites();

    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: {
            disconnect: { id },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  async addArtist(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }

    try {
      await this.artistService.getArtist(id);
    } catch {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    const favorites = await this.getOrCreateFavorites();

    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: {
          connect: { id },
        },
      },
    });
  }

  async removeArtist(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }

    const favorites = await this.getOrCreateFavorites();

    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: {
            disconnect: { id },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }
}
