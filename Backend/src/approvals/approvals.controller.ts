import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { ApproveExpenseDto } from './dto/approve-expense.dto';
import { RejectExpenseDto } from './dto/reject-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Approvals')
@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post(':expenseId/approve')
  @Roles('manager', 'admin')
  @ApiOperation({ summary: 'Approve an expense' })
  @ApiResponse({ status: 200, description: 'Expense approved successfully' })
  approveExpense(
    @Param('expenseId') expenseId: string,
    @Body() approveDto: ApproveExpenseDto,
    @Request() req,
  ) {
    return this.approvalsService.approveExpense(
      expenseId,
      req.user.userId,
      approveDto.comments,
    );
  }

  @Post(':expenseId/reject')
  @Roles('manager', 'admin')
  @ApiOperation({ summary: 'Reject an expense' })
  @ApiResponse({ status: 200, description: 'Expense rejected successfully' })
  rejectExpense(
    @Param('expenseId') expenseId: string,
    @Body() rejectDto: RejectExpenseDto,
    @Request() req,
  ) {
    return this.approvalsService.rejectExpense(
      expenseId,
      req.user.userId,
      rejectDto.reason,
      rejectDto.comments,
    );
  }

  @Get('history/:expenseId')
  @ApiOperation({ summary: 'Get approval history for an expense' })
  @ApiResponse({ status: 200, description: 'Return approval history' })
  getApprovalHistory(@Param('expenseId') expenseId: string) {
    return this.approvalsService.getApprovalHistory(expenseId);
  }

  @Get('pending')
  @Roles('manager', 'admin')
  @ApiOperation({ summary: 'Get pending approvals for current user' })
  @ApiResponse({ status: 200, description: 'Return pending approvals' })
  getPendingApprovals(@Request() req) {
    return this.approvalsService.getPendingApprovals(req.user.userId);
  }
}
