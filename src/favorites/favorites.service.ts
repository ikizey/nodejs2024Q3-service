import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './favorites.entity';
import { validate as uuidValidate } from 'uuid';
import { ArtistService } from '../artists/artist.service';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    const response: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    for (const id of this.favorites.artists) {
      try {
        const artist = this.artistService.getArtist(id);
        response.artists.push(artist);
      } catch {}
    }

    for (const id of this.favorites.albums) {
      try {
        const album = this.albumService.getAlbum(id);
        response.albums.push(album);
      } catch {}
    }

    for (const id of this.favorites.tracks) {
      try {
        const track = this.trackService.getTrack(id);
        response.tracks.push(track);
      } catch {}
    }

    return response;
  }

  async addTrack(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    try {
      this.trackService.getTrack(id);
    } catch {
      throw new UnprocessableEntityException('Track does not exist');
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  async removeTrack(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }

    this.favorites.tracks.splice(index, 1);
  }

  async addAlbum(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    try {
      this.albumService.getAlbum(id);
    } catch {
      throw new UnprocessableEntityException('Album does not exist');
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }

    this.favorites.albums.splice(index, 1);
  }

  async addArtist(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }

    try {
      this.artistService.getArtist(id);
    } catch {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  async removeArtist(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID');
    }

    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }

    this.favorites.artists.splice(index, 1);
  }

  removeDeletedEntity(type: 'artists' | 'albums' | 'tracks', id: string): void {
    const index = this.favorites[type].indexOf(id);
    if (index !== -1) {
      this.favorites[type].splice(index, 1);
    }
  }
}
