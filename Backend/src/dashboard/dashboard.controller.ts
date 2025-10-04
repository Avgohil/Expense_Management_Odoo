import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('company-stats')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get company-wide expense statistics' })
  @ApiResponse({ status: 200, description: 'Return company stats' })
  getCompanyStats(@Request() req) {
    return this.dashboardService.getCompanyStats(req.user.companyId);
  }

  @Get('user-stats')
  @ApiOperation({ summary: 'Get user expense statistics' })
  @ApiResponse({ status: 200, description: 'Return user stats' })
  getUserStats(@Request() req) {
    return this.dashboardService.getUserStats(req.user.userId);
  }

  @Get('expenses-by-category')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get expenses grouped by category' })
  @ApiResponse({ status: 200, description: 'Return expenses by category' })
  getExpensesByCategory(@Request() req) {
    return this.dashboardService.getExpensesByCategory(req.user.companyId);
  }

  @Get('monthly-trend')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get monthly expense trend' })
  @ApiResponse({ status: 200, description: 'Return monthly trend' })
  getMonthlyTrend(@Request() req, @Query('months') months?: number) {
    return this.dashboardService.getMonthlyTrend(
      req.user.companyId,
      months ? parseInt(months.toString()) : 6,
    );
  }

  @Get('top-spenders')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get top spenders in the company' })
  @ApiResponse({ status: 200, description: 'Return top spenders' })
  getTopSpenders(@Request() req, @Query('limit') limit?: number) {
    return this.dashboardService.getTopSpenders(
      req.user.companyId,
      limit ? parseInt(limit.toString()) : 10,
    );
  }
}
