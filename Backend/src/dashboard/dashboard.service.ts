import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument, ExpenseStatus } from '../expenses/schemas/expense.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async getCompanyStats(companyId: string): Promise<any> {
    const expenses = await this.expenseModel.find({
      company: new Types.ObjectId(companyId),
    });

    const totalExpenses = expenses.length;
    const pendingCount = expenses.filter(
      (e) => e.status === ExpenseStatus.PENDING,
    ).length;
    const approvedCount = expenses.filter(
      (e) => e.status === ExpenseStatus.APPROVED,
    ).length;
    const rejectedCount = expenses.filter(
      (e) => e.status === ExpenseStatus.REJECTED,
    ).length;

    const totalAmount = expenses
      .filter((e) => e.status === ExpenseStatus.APPROVED)
      .reduce((sum, e) => sum + (e as any).convertedAmount, 0);

    const thisMonthExpenses = expenses.filter((e) => {
      const date = new Date(e.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });

    const thisMonthAmount = thisMonthExpenses.reduce(
      (sum, e) => sum + (e as any).convertedAmount,
      0,
    );

    return {
      totalExpenses,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalAmount,
      thisMonthExpenses: thisMonthExpenses.length,
      thisMonthAmount,
    };
  }

  async getUserStats(userId: string): Promise<any> {
    const expenses = await this.expenseModel.find({
      employee: new Types.ObjectId(userId),
    });

    const totalExpenses = expenses.length;
    const pendingCount = expenses.filter(
      (e) => e.status === ExpenseStatus.PENDING,
    ).length;
    const approvedCount = expenses.filter(
      (e) => e.status === ExpenseStatus.APPROVED,
    ).length;
    const rejectedCount = expenses.filter(
      (e) => e.status === ExpenseStatus.REJECTED,
    ).length;

    const totalAmount = expenses
      .filter((e) => e.status === ExpenseStatus.APPROVED)
      .reduce((sum, e) => sum + (e as any).convertedAmount, 0);

    return {
      totalExpenses,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalAmount,
    };
  }

  async getExpensesByCategory(companyId: string): Promise<any> {
    const result = await this.expenseModel.aggregate([
      { $match: { company: new Types.ObjectId(companyId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          total: { $sum: '$convertedAmount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return result;
  }

  async getMonthlyTrend(companyId: string, months: number = 6): Promise<any> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);

    const result = await this.expenseModel.aggregate([
      {
        $match: {
          company: new Types.ObjectId(companyId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          total: { $sum: '$convertedAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return result;
  }

  async getTopSpenders(companyId: string, limit: number = 10): Promise<any> {
    const result = await this.expenseModel.aggregate([
      { $match: { company: new Types.ObjectId(companyId) } },
      {
        $group: {
          _id: '$employee',
          count: { $sum: 1 },
          total: { $sum: '$convertedAmount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          count: 1,
          total: 1,
          'user.name': 1,
          'user.email': 1,
        },
      },
    ]);

    return result;
  }
}
