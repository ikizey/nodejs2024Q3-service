import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { ArtistModule } from '../artists/artist.module';
import { AlbumModule } from '../albums/album.module';
import { TrackModule } from '../tracks/track.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ArtistModule, AlbumModule, TrackModule, PrismaModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
