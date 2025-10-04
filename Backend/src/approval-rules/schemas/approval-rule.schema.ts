import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Approver } from './approver.schema';

export type ApprovalRuleDocument = ApprovalRule & Document;

@Schema({ timestamps: true })
export class ApprovalRule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true })
  company: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isManagerApprover: boolean;

  @Prop({ default: false })
  sequenceMatters: boolean;

  @Prop()
  minimumApprovalPercentage: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Approver' }] })
  approvers: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ApprovalRuleSchema = SchemaFactory.createForClass(ApprovalRule);
