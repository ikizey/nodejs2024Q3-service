import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Album } from './album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import { ArtistService } from '../artists/artist.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(private readonly artistService: ArtistService) {}

  getAlbums(): Album[] {
    return this.albums;
  }

  getAlbum(id: string): Album {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  createAlbum(albumData: CreateAlbumDto): Album {
    const { name, year, artistId } = albumData;
    if (!name || typeof year !== 'number') {
      throw new BadRequestException('Name and year are required');
    }

    if (artistId) {
      this.artistService.getArtist(artistId);
    }

    const newAlbum: Album = {
      id: uuid(),
      name,
      year,
      artistId,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  updateAlbum(id: string, albumData: UpdateAlbumDto): Album {
    const { name, year, artistId } = albumData;
    if (!name || typeof year !== 'number') {
      throw new BadRequestException('Name and year are required');
    }

    if (artistId) {
      this.artistService.getArtist(artistId);
    }

    const album = this.getAlbum(id);
    Object.assign(album, { name, year, artistId });
    return album;
  }

  deleteAlbum(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    this.albums.splice(index, 1);
  }
}
