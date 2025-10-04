import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApprovalRuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isManagerApprover?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  sequenceMatters?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minimumApprovalPercentage?: number;

  @ApiProperty({ type: [Object] })
  @IsArray()
  @IsNotEmpty()
  approvers: Array<{
    userId: string;
    sequenceOrder: number;
    isRequired: boolean;
  }>;
}
