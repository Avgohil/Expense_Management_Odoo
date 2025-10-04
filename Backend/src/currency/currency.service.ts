import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

interface CacheEntry {
  rates: { [key: string]: number };
  timestamp: number;
}

@Injectable()
export class CurrencyService {
  private readonly restCountriesApi = process.env.REST_COUNTRIES_API;
  private readonly exchangeRateApi = process.env.EXCHANGE_RATE_API;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private exchangeRateCache: Map<string, CacheEntry> = new Map();

  async getCurrencies() {
    try {
      const response = await axios.get(this.restCountriesApi);
      const currencies = new Map();

      response.data.forEach((country: any) => {
        if (country.currencies) {
          Object.entries(country.currencies).forEach(([code, currency]: [string, any]) => {
            if (!currencies.has(code)) {
              currencies.set(code, {
                code,
                name: currency.name,
                symbol: currency.symbol,
              });
            }
          });
        }
      });

      return Array.from(currencies.values());
    } catch (error) {
      throw new HttpException(
        'Failed to fetch currencies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      const now = Date.now();
      const cacheKey = from;

      // Check if cache exists and is still valid (within 24 hours)
      const cached = this.exchangeRateCache.get(cacheKey);
      if (cached && now - cached.timestamp < this.CACHE_DURATION) {
        return cached.rates[to] || 1;
      }

      // Fetch new rates
      const response = await axios.get(`${this.exchangeRateApi}/${from}`);
      const rates = response.data.rates;

      // Store in cache with timestamp
      this.exchangeRateCache.set(cacheKey, {
        rates,
        timestamp: now,
      });

      return rates[to] || 1;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch exchange rate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async convertCurrency(
    amount: number,
    from: string,
    to: string,
  ): Promise<number> {
    const rate = await this.getExchangeRate(from, to);
    return amount * rate;
  }
}
