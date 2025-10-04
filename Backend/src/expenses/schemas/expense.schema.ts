import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type ExpenseDocument = Expense & Document;

export enum ExpenseStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  employee: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  originalCurrency: string;

  @Prop({ required: true })
  convertedAmount: number;

  @Prop({ required: true })
  baseCurrency: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  expenseDate: Date;

  @Prop({ type: String, enum: ExpenseStatus, default: ExpenseStatus.DRAFT })
  status: ExpenseStatus;

  @Prop()
  paidBy: string;

  @Prop()
  remarks: string;

  @Prop()
  receiptUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalRule' })
  appliedRule: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
