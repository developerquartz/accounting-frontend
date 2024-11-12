import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import axiosInstance from "@/app/axiosInstance";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      name,
      contact,
      contactPerson,
      email,
      gst,
      pan,
      address,
      city,
      state,
      manager,
      pincode,
    } = reqBody;
    console.log("reqBody", reqBody);
    console.log("name", name, "city", city);

    const responseFromServer = await axiosInstance.post(
      "http://localhost:3001/clients",
      {
        name,
        contact,
        contactPerson,
        email,
        gst,
        pan,
        address,
        city,
        state,
        manager,
        pincode,
      }
    );
    console.log("In Server", responseFromServer.data);

    if (responseFromServer.data) {
      return NextResponse.json({
        message: "Client created successfully",
        success: true,
      });
    } else {
      console.error(
        "Unexpected response from server:",
        responseFromServer.data
      );
      return NextResponse.json(
        {
          message: "Unexpected error occurred while creating the client.",
          success: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error during client creation:", error);
    return NextResponse.json({
      message: "An error occurred while processing the request.",
      success: false,
    });
  }
}
