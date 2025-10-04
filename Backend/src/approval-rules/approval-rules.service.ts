import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApprovalRule, ApprovalRuleDocument } from './schemas/approval-rule.schema';
import { CreateApprovalRuleDto } from './dto/create-approval-rule.dto';

@Injectable()
export class ApprovalRulesService {
  constructor(
    @InjectModel(ApprovalRule.name)
    private approvalRuleModel: Model<ApprovalRuleDocument>,
  ) {}

  async create(
    createApprovalRuleDto: CreateApprovalRuleDto,
    companyId: string,
  ): Promise<ApprovalRuleDocument> {
    const rule = new this.approvalRuleModel({
      ...createApprovalRuleDto,
      company: new Types.ObjectId(companyId),
    });
    return rule.save();
  }

  async findAll(companyId: string): Promise<ApprovalRuleDocument[]> {
    return this.approvalRuleModel
      .find({ company: new Types.ObjectId(companyId) })
      .populate('approvers.user', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ApprovalRuleDocument> {
    const rule = await this.approvalRuleModel.findById(id).exec();
    if (!rule) {
      throw new NotFoundException('Approval rule not found');
    }
    return rule;
  }

  async update(
    id: string,
    updateDto: Partial<CreateApprovalRuleDto>,
  ): Promise<ApprovalRuleDocument> {
    const rule = await this.approvalRuleModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!rule) {
      throw new NotFoundException('Approval rule not found');
    }

    return rule;
  }

  async remove(id: string): Promise<void> {
    const result = await this.approvalRuleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Approval rule not found');
    }
  }

  async findApplicableRule(
    companyId: string,
    amount: number,
  ): Promise<ApprovalRuleDocument | null> {
    // Find rules for the company sorted by creation date
    const rules = await this.approvalRuleModel
      .find({
        company: new Types.ObjectId(companyId),
      })
      .populate('approvers.user', 'name email')
      .sort({ createdAt: 1 })
      .exec();

    // Return first matching rule (can add more complex logic later)
    return rules.length > 0 ? rules[0] : null;
  }
}
