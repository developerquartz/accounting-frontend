import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout Success",
      success: true,
    });
    response.cookies.set("token", "", {
      // httpOnly: true,
      // expires: new Date(0),
    });
    response.cookies.set("role", "");
    response.cookies.set("clientId", "");
    response.cookies.set("OrgId", "");
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
