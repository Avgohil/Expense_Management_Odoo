import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type ApproverDocument = Approver & Document;

@Schema()
export class Approver {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  sequenceOrder: number;

  @Prop({ default: false })
  isRequired: boolean;
}

export const ApproverSchema = SchemaFactory.createForClass(Approver);
