import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveExpenseDto {
  @ApiProperty({ required: false })
  @IsString()
  comments?: string;
}
