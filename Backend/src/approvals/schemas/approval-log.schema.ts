import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type ApprovalLogDocument = ApprovalLog & Document;

export enum ApprovalStatus {
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PENDING = 'Pending',
}

@Schema({ timestamps: true })
export class ApprovalLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true })
  expense: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  approver: Types.ObjectId;

  @Prop({ type: String, enum: ApprovalStatus, required: true })
  status: ApprovalStatus;

  @Prop()
  comments: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalRule' })
  approvalRule: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const ApprovalLogSchema = SchemaFactory.createForClass(ApprovalLog);
