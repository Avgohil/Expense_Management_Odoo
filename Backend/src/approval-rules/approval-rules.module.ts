import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApprovalRulesService } from './approval-rules.service';
import { ApprovalRulesController } from './approval-rules.controller';
import { ApprovalRule, ApprovalRuleSchema } from './schemas/approval-rule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApprovalRule.name, schema: ApprovalRuleSchema },
    ]),
  ],
  controllers: [ApprovalRulesController],
  providers: [ApprovalRulesService],
  exports: [ApprovalRulesService],
})
export class ApprovalRulesModule {}
