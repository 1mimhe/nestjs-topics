import { IsString } from 'class-validator';

// Here, we define data shapes and validate incoming or outgoing data.

export class CreateMessageDto {
  @IsString()
  content: string;
}
