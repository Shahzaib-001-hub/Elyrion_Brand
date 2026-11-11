import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IQuizOption {
  id: string;
  label: string;
  tagline: string;
  iconName?: string;
  associatedMoods: string[];
  associatedNotes: string[];
}

export interface IQuizStep {
  stepNumber: number;
  question: string;
  subtitle: string;
  options: IQuizOption[];
}

export interface IMoodQuizConfig extends Document {
  version: number;
  steps: IQuizStep[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizOptionSchema = new Schema<IQuizOption>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  tagline: { type: String, required: true },
  iconName: { type: String },
  associatedMoods: { type: [String], default: [] },
  associatedNotes: { type: [String], default: [] },
});

const QuizStepSchema = new Schema<IQuizStep>({
  stepNumber: { type: Number, required: true },
  question: { type: String, required: true },
  subtitle: { type: String, required: true },
  options: [QuizOptionSchema],
});

const MoodQuizConfigSchema = new Schema<IMoodQuizConfig>(
  {
    version: { type: Number, default: 1 },
    steps: [QuizStepSchema],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MoodQuizConfig: Model<IMoodQuizConfig> =
  mongoose.models.MoodQuizConfig ||
  mongoose.model<IMoodQuizConfig>('MoodQuizConfig', MoodQuizConfigSchema);

export default MoodQuizConfig;
