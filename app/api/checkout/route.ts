import { NEXT_PUBLIC_STRIPE_SECRET_KEY } from "@/constants/configGlobal";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Method": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer)
      return new NextResponse("Not enough data to checkout", { status: 400 });
  } catch (error) {
    console.log("[checkout_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
