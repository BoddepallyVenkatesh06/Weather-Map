import mongoose, { Schema, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    emailVerified: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export const WeatherUsers =
  models.WeatherUsers || mongoose.model("WeatherUsers", userSchema);
