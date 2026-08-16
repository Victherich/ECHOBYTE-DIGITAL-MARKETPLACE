import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { 
      email, 
      business_name, 
      settlement_bank, 
      account_number, 
      percentage_charge 
    } = await req.json();

    // 1. Validate Input
    if (!email || !business_name || !settlement_bank || !account_number) {
      return NextResponse.json(
        { status: false, message: "Missing required account details" }, 
        { status: 400 }
      );
    }

    // 2. Send request to Paystack API
    const response = await fetch("https://api.paystack.co/subaccount", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Ensure this is in your .env.local
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: business_name,
        settlement_bank: settlement_bank,
        account_number: account_number,
        percentage_charge: percentage_charge, // Your platform commission split
        primary_contact_email: email
      }),
    });

    const result = await response.json();

    // 3. Handle Paystack Response
    if (!response.ok || !result.status) {
      return NextResponse.json(
        { status: false, message: result.message || "Paystack creation failed" },
        { status: response.status }
      );
    }

    // 4. Return success
    return NextResponse.json({ 
      status: true, 
      data: result.data 
    });

  } catch (error) {
    console.error("Paystack Subaccount Error:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}