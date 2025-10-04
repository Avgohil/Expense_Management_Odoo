import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ApprovalRulesModule } from './approval-rules/approval-rules.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { OcrModule } from './ocr/ocr.module';
import { CurrencyModule } from './currency/currency.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-management',
    ),
    AuthModule,
    UsersModule,
    CompaniesModule,
    ExpensesModule,
    ApprovalRulesModule,
    ApprovalsModule,
    OcrModule,
    CurrencyModule,
    NotificationsModule,
    DashboardModule,
  ],
})
export class AppModule {}
