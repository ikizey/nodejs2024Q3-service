import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { ArtistModule } from '../artists/artist.module';
import { AlbumModule } from '../albums/album.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ArtistModule, AlbumModule, PrismaModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
