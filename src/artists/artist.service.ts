import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid, validate as uuidValidate } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  getArtists(): Artist[] {
    return this.artists;
  }

  getArtist(id: string): Artist {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  createArtist(artistData: CreateArtistDto): Artist {
    const { name, grammy } = artistData;
    if (!name || !grammy) {
      throw new BadRequestException('Name and grammy are required');
    }

    const newArtist: Artist = {
      id: uuid(),
      name,
      grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, artistData: UpdateArtistDto): Artist {
    const { name, grammy } = artistData;
    if (!name || !grammy) {
      throw new BadRequestException('Name and grammy are required');
    }

    const artist = this.getArtist(id);
    Object.assign(artist, { name, grammy });
    return artist;
  }

  deleteArtist(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    this.artists.splice(index, 1);
  }
}
