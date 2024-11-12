import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const responseFromServer = await axios.post(
      "http://localhost:3001/users/signup",
      {
        email,
        password,
      }
    );
    return NextResponse.json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error in catch",
      success: false,
    });
  }
}
