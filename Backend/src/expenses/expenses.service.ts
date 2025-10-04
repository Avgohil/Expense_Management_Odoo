import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument, ExpenseStatus } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    private currencyService: CurrencyService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
    companyId: string,
  ): Promise<ExpenseDocument> {
    // Get company to fetch base currency
    // For now assuming USD as base currency, should fetch from company
    const baseCurrency = 'USD';
    let exchangeRate = 1;
    let convertedAmount = createExpenseDto.amount;

    if (createExpenseDto.originalCurrency !== baseCurrency) {
      exchangeRate = await this.currencyService.getExchangeRate(
        createExpenseDto.originalCurrency,
        baseCurrency,
      );
      convertedAmount = createExpenseDto.amount * exchangeRate;
    }

    const expense = new this.expenseModel({
      ...createExpenseDto,
      employee: new Types.ObjectId(userId),
      company: new Types.ObjectId(companyId),
      exchangeRate,
      convertedAmount,
      baseCurrency,
      status: ExpenseStatus.DRAFT,
    });

    return expense.save();
  }

  async findAll(
    companyId: string,
    userId?: string,
    status?: string,
  ): Promise<ExpenseDocument[]> {
    const filter: any = { company: new Types.ObjectId(companyId) };

    if (userId) {
      filter.employee = new Types.ObjectId(userId);
    }

    if (status) {
      filter.status = status;
    }

    return this.expenseModel
      .find(filter)
      .populate('employee', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ExpenseDocument> {
    const expense = await this.expenseModel
      .findById(id)
      .populate('employee', 'name email')
      .populate('appliedRule')
      .exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseDocument> {
    const expense = await this.expenseModel.findById(id);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.status !== ExpenseStatus.DRAFT) {
      throw new BadRequestException('Can only update draft expenses');
    }

    // Recalculate exchange rate if currency or amount changed
    if (updateExpenseDto.originalCurrency || updateExpenseDto.amount) {
      const currency = updateExpenseDto.originalCurrency || expense.originalCurrency;
      const amount = updateExpenseDto.amount || expense.amount;
      const baseCurrency = expense.baseCurrency || 'USD';

      if (currency !== baseCurrency) {
        const exchangeRate = await this.currencyService.getExchangeRate(
          currency,
          baseCurrency,
        );
        updateExpenseDto['exchangeRate'] = exchangeRate;
        updateExpenseDto['convertedAmount'] = amount * exchangeRate;
      } else {
        updateExpenseDto['exchangeRate'] = 1;
        updateExpenseDto['convertedAmount'] = amount;
      }
    }

    Object.assign(expense, updateExpenseDto);
    return expense.save();
  }

  async remove(id: string): Promise<void> {
    const expense = await this.expenseModel.findById(id);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.status !== ExpenseStatus.DRAFT) {
      throw new BadRequestException('Can only delete draft expenses');
    }

    await this.expenseModel.findByIdAndDelete(id);
  }

  async submit(id: string): Promise<ExpenseDocument> {
    const expense = await this.expenseModel.findById(id);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.status !== ExpenseStatus.DRAFT) {
      throw new BadRequestException('Can only submit draft expenses');
    }

    expense.status = ExpenseStatus.SUBMITTED;
    return expense.save();
  }

  async getExpensesByUser(
    userId: string,
    status?: string,
  ): Promise<ExpenseDocument[]> {
    const filter: any = { employee: new Types.ObjectId(userId) };

    if (status) {
      filter.status = status;
    }

    return this.expenseModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPendingApprovals(companyId: string): Promise<ExpenseDocument[]> {
    return this.expenseModel
      .find({
        company: new Types.ObjectId(companyId),
        status: ExpenseStatus.PENDING,
      })
      .populate('employee', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
