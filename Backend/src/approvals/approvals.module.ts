import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController } from './approvals.controller';
import { ApprovalLog, ApprovalLogSchema } from './schemas/approval-log.schema';
import { Expense, ExpenseSchema } from '../expenses/schemas/expense.schema';
import { ApprovalRule, ApprovalRuleSchema } from '../approval-rules/schemas/approval-rule.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApprovalLog.name, schema: ApprovalLogSchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: ApprovalRule.name, schema: ApprovalRuleSchema },
    ]),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
