import { mongoDBConnection } from "@/lib/mongodb";
import { CityModel } from "@/models/city";
import { WeatherUsers } from "@/models/weatherUsers";
import { isEmptyOrSpaces } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = await new URL(req.url);
  const email = searchParams.get("email")!;
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
      const getUserCities = await CityModel.find({ user: user });
      return NextResponse.json(
        { message: "success", data: getUserCities, status: 200 },
        { status: 200, statusText: "success" }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "oops, something went wrong" },
      { status: 501 }
    );
  }
};
