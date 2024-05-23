import { mongoDBConnection } from "@/lib/mongodb";
import { CityModel } from "@/models/city";
import { WeatherUsers } from "@/models/weatherUsers";
import { isEmptyOrSpaces } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = await new URL(req.url);
  const email = searchParams.get("email")!;
  const cityName = searchParams.get("cityName")!;
  await mongoDBConnection();
  try {
    if (isEmptyOrSpaces(email)) {
      return NextResponse.json(
        {
          message: "Fields can't be empty",
          statusCode: 204,
        },
        { status: 204 }
      );
    }
    const user = await WeatherUsers.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } else {
      const deleteCity = await CityModel.deleteOne({
        user: user,
        name: cityName,
      });
      if (deleteCity.deletedCount === 0) {
        return NextResponse.json(
          { message: "City does not exist" },
          { status: 404, statusText: "success" }
        );
      }
      return NextResponse.json(
        { message: "City deleted" },
        { status: 202, statusText: "success" }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "oops, something went wrong" },
      { status: 501 }
    );
  }
};
