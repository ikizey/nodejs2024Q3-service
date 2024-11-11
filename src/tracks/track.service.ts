import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import { ArtistService } from '../artists/artist.service';
import { AlbumService } from '../albums/album.service';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  getTracks(): Track[] {
    return this.tracks;
  }

  getTrack(id: string): Track {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  createTrack(trackData: CreateTrackDto): Track {
    const { name, artistId, albumId, duration } = trackData;
    if (!name || typeof duration !== 'number') {
      throw new BadRequestException('Name and duration are required');
    }

    if (artistId) {
      try {
        this.artistService.getArtist(artistId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Artist not found');
        }
        throw error;
      }
    }

    if (albumId) {
      try {
        this.albumService.getAlbum(albumId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Album not found');
        }
        throw error;
      }
    }

    const newTrack: Track = {
      id: uuid(),
      name,
      duration,
      artistId: artistId || null,
      albumId: albumId || null,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  updateTrack(id: string, trackData: UpdateTrackDto): Track {
    const { name, duration, artistId, albumId } = trackData;
    if (!name || typeof duration !== 'number') {
      throw new BadRequestException('Name and duration are required');
    }

    if (artistId) {
      try {
        this.artistService.getArtist(artistId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Artist not found');
        }
        throw error;
      }
    }

    if (albumId) {
      try {
        this.albumService.getAlbum(albumId);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new BadRequestException('Album not found');
        }
        throw error;
      }
    }

    const track = this.getTrack(id);
    Object.assign(track, {
      name,
      duration,
      artistId: artistId || null,
      albumId: albumId || null,
    });
    return track;
  }

  deleteTrack(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    this.tracks.splice(index, 1);
  }
}
