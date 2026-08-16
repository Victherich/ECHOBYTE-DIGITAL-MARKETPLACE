import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { subaccount_code } = await req.json();

    if (!subaccount_code) {
      return NextResponse.json(
        { status: false, message: "Missing subaccount code" },
        { status: 400 }
      );
    }

    // Paystack allows updating/deactivating a subaccount via PUT /subaccount/:id_or_code
    // To disable/deactivate a subaccount, set active: false
    const response = await fetch(`https://api.paystack.co/subaccount/${subaccount_code}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        active: false,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      return NextResponse.json(
        { status: false, message: result.message || "Failed to disable subaccount on Paystack" },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: true, data: result.data });
  } catch (error) {
    console.error("Paystack Delete Subaccount Error:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}