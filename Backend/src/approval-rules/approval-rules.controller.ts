import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApprovalRulesService } from './approval-rules.service';
import { CreateApprovalRuleDto } from './dto/create-approval-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Approval Rules')
@Controller('approval-rules')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApprovalRulesController {
  constructor(private readonly approvalRulesService: ApprovalRulesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new approval rule' })
  @ApiResponse({ status: 201, description: 'Approval rule created successfully' })
  create(@Body() createApprovalRuleDto: CreateApprovalRuleDto, @Request() req) {
    return this.approvalRulesService.create(
      createApprovalRuleDto,
      req.user.companyId,
    );
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get all approval rules' })
  @ApiResponse({ status: 200, description: 'Return all approval rules' })
  findAll(@Request() req) {
    return this.approvalRulesService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get approval rule by id' })
  @ApiResponse({ status: 200, description: 'Return approval rule' })
  findOne(@Param('id') id: string) {
    return this.approvalRulesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update approval rule' })
  @ApiResponse({ status: 200, description: 'Approval rule updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateApprovalRuleDto>,
  ) {
    return this.approvalRulesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete approval rule' })
  @ApiResponse({ status: 200, description: 'Approval rule deleted successfully' })
  remove(@Param('id') id: string) {
    return this.approvalRulesService.remove(id);
  }
}
