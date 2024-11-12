import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { axiosInstance } from "../../../axiosInstance";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;
    const response = await axiosInstance.post("/users/signin", {
      username,
      password,
    });
    console.log("from server", response.data);
    console.log("clientdata", response.data.data.clientId);

    if (response.data.data) {
      const token = response.data.data.access_token;
      console.log("Token ", token);
      const userRole = response.data.data.role;
      const clientId = response.data.data.clientId;
      const id = response.data.data.organizationId;
      // const orgId = id.toString();
      console.log(userRole);
      console.log("org", id);

      const res = NextResponse.json({
        message: "Login Successfully",
        success: true,
      });
      res.cookies.set("token", token, {
        // httpOnly: true,
      });
      res.cookies.set("role", userRole);

      res.cookies.set("clientId", clientId);
      res.cookies.set("OrgId", id);
      return res;
    } else {
      return "No token availavle";
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
