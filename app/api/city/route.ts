import { mongoDBConnection } from "@/lib/mongodb";
import { CityModel } from "@/models/city";
import { WeatherUsers } from "@/models/weatherUsers";
import { isEmptyOrSpaces } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name, image, email, coordinates } = await req.json();
  await mongoDBConnection();
  try {
    if (isEmptyOrSpaces(name) || isEmptyOrSpaces(email)) {
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
      const cityExist = await CityModel.findOne({ name, user });
      if (cityExist) {
        return NextResponse.json(
          { message: "City Already Exist" },
          { status: 409 }
        );
      } else {
        const c = await CityModel.create({
          name,
          image,
          user,
          location: {
            type: "Point",
            coordinates: [coordinates?.lat, coordinates?.lng],
          },
        });
        return NextResponse.json(
          {
            message: "New city added",
            statusCode: 201,
            data: c,
          },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Oops, something went wrong" },
      { status: 501 }
    );
  }
};
