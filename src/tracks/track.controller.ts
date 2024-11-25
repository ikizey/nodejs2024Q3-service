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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';
import { Track } from './track.entity';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getTracks(): Promise<Track[]> {
    return this.trackService.getTracks();
  }

  @Get(':id')
  async getTrack(@Param('id') id: string): Promise<Track> {
    return this.trackService.getTrack(id);
  }

  @Post()
  async createTrack(@Body() trackData: CreateTrackDto): Promise<Track> {
    return this.trackService.createTrack(trackData);
  }

  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() trackData: UpdateTrackDto,
  ): Promise<Track> {
    return this.trackService.updateTrack(id, trackData);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(@Param('id') id: string): Promise<void> {
    this.trackService.deleteTrack(id);
  }
}
