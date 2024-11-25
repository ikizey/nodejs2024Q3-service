import { Allow, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ groups: ['refresh'] })
  @IsNotEmpty({ groups: ['refresh'] })
  @Allow()
  refreshToken: string;
}
