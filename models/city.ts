import mongoose, { Schema, models } from "mongoose";

export interface ICity extends Document {
  name: string;
  image: string;
  user: any;
}

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const citySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "WeatherUsers",
    },
    location: {
      type: pointSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const CityModel =
  models.CityModel || mongoose.model("CityModel", citySchema);
