import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Currency')
@Controller('currency')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get all available currencies' })
  @ApiResponse({ status: 200, description: 'Return all currencies' })
  getCurrencies() {
    return this.currencyService.getCurrencies();
  }

  @Get('exchange-rate')
  @ApiOperation({ summary: 'Get exchange rate between two currencies' })
  @ApiResponse({ status: 200, description: 'Return exchange rate' })
  getExchangeRate(@Query('from') from: string, @Query('to') to: string) {
    return this.currencyService.getExchangeRate(from, to);
  }

  @Get('convert')
  @ApiOperation({ summary: 'Convert amount between currencies' })
  @ApiResponse({ status: 200, description: 'Return converted amount' })
  async convertCurrency(
    @Query('amount') amount: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const converted = await this.currencyService.convertCurrency(amount, from, to);
    return { amount, from, to, converted };
  }
}
