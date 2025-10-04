import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApprovalLog, ApprovalLogDocument, ApprovalStatus } from './schemas/approval-log.schema';
import { Expense, ExpenseDocument, ExpenseStatus } from '../expenses/schemas/expense.schema';
import { ApprovalRule, ApprovalRuleDocument } from '../approval-rules/schemas/approval-rule.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectModel(ApprovalLog.name)
    private approvalLogModel: Model<ApprovalLogDocument>,
    @InjectModel(Expense.name)
    private expenseModel: Model<ExpenseDocument>,
    @InjectModel(ApprovalRule.name)
    private approvalRuleModel: Model<ApprovalRuleDocument>,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  async approveExpense(
    expenseId: string,
    approverId: string,
    comments?: string,
  ): Promise<ExpenseDocument> {
    const expense = await this.expenseModel
      .findById(expenseId)
      .populate('employee')
      .populate('appliedRule');

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('Expense is not pending approval');
    }

    const rule: any = expense.appliedRule;
    if (!rule) {
      throw new BadRequestException('No approval rule applied to this expense');
    }

    // Create approval log
    const approvalLog = new this.approvalLogModel({
      expense: new Types.ObjectId(expenseId),
      approver: new Types.ObjectId(approverId),
      approvalRule: rule._id,
      status: ApprovalStatus.APPROVED,
      comments,
    });
    await approvalLog.save();

    // Check if expense should be approved based on approval rule
    const shouldApprove = await this.checkApprovalStatus(expenseId, rule);

    if (shouldApprove) {
      expense.status = ExpenseStatus.APPROVED;
      await expense.save();

      // Send notification
      const user: any = expense.employee;
      const approver = await this.usersService.findOne(approverId);
      await this.notificationsService.sendExpenseApprovedNotification(user.email, {
        title: expense.description,
        amount: expense.amount,
        currency: expense.originalCurrency,
        approvedBy: approver.name,
      });
    }

    return expense;
  }

  async rejectExpense(
    expenseId: string,
    approverId: string,
    reason: string,
    comments?: string,
  ): Promise<ExpenseDocument> {
    const expense = await this.expenseModel
      .findById(expenseId)
      .populate('employee')
      .populate('appliedRule');

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.status !== ExpenseStatus.PENDING) {
      throw new BadRequestException('Expense is not pending approval');
    }

    const rule: any = expense.appliedRule;

    // Create approval log
    const approvalLog = new this.approvalLogModel({
      expense: new Types.ObjectId(expenseId),
      approver: new Types.ObjectId(approverId),
      approvalRule: rule?._id,
      status: ApprovalStatus.REJECTED,
      comments: comments || reason,
    });
    await approvalLog.save();

    // Update expense status
    expense.status = ExpenseStatus.REJECTED;
    await expense.save();

    // Send notification
    const user: any = expense.employee;
    await this.notificationsService.sendExpenseRejectedNotification(user.email, {
      title: expense.description,
      amount: expense.amount,
      currency: expense.originalCurrency,
      rejectionReason: reason,
    });

    return expense;
  }

  async getApprovalHistory(expenseId: string): Promise<ApprovalLogDocument[]> {
    return this.approvalLogModel
      .find({ expense: new Types.ObjectId(expenseId) })
      .populate('approver', 'name email')
      .populate('approvalRule')
      .sort({ createdAt: 1 })
      .exec();
  }

  async getPendingApprovals(approverId: string): Promise<ExpenseDocument[]> {
    // Find all pending expenses where this user is an approver
    return this.expenseModel
      .find({ status: ExpenseStatus.PENDING })
      .populate('employee', 'name email')
      .populate('appliedRule')
      .sort({ createdAt: -1 })
      .exec();
  }

  private async checkApprovalStatus(
    expenseId: string,
    rule: any,
  ): Promise<boolean> {
    // Get all approval logs for this expense
    const approvalLogs = await this.approvalLogModel.find({
      expense: new Types.ObjectId(expenseId),
      status: ApprovalStatus.APPROVED,
    });

    const totalApprovers = rule.approvers.length;
    const requiredApprovers = rule.approvers.filter((a: any) => a.required);
    const approvedCount = approvalLogs.length;

    // Check if all required approvers have approved
    for (const requiredApprover of requiredApprovers) {
      const hasApproved = approvalLogs.some(
        (log: any) => log.approver.toString() === (requiredApprover as any).user.toString(),
      );
      if (!hasApproved) {
        return false;
      }
    }

    // Check sequence if it matters
    if (rule.sequenceMatters) {
      // Get sorted approvers by sequence
      const sortedApprovers = [...rule.approvers].sort(
        (a: any, b: any) => a.sequenceOrder - b.sequenceOrder,
      );

      // Check if approvals follow the sequence
      for (let i = 0; i < approvedCount; i++) {
        const expectedApproverId = (sortedApprovers[i] as any).user.toString();
        const actualApproverId = (approvalLogs[i] as any).approver.toString();
        if (expectedApproverId !== actualApproverId) {
          return false;
        }
      }

      // If sequence matters, need all approvals in order
      return approvedCount === totalApprovers;
    }

    // Check minimum approval percentage
    if (rule.minimumApprovalPercentage) {
      const approvalPercentage = (approvedCount / totalApprovers) * 100;
      return approvalPercentage >= rule.minimumApprovalPercentage;
    }

    // Default: need all approvers to approve
    return approvedCount === totalApprovers;
  }
}
