import { IsDefined, IsString } from 'class-validator';

export class AuthDto {
  @IsDefined()
  @IsString()
  login: string;

  @IsDefined()
  @IsString()
  password: string;
}
