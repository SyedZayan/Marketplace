// pages/api/stripe/checkout_sessions.ts
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Ensure that process.env.STRIPE_SECRET_KEY is defined.
// You can add a console.log to verify it (but remove it in production).
console.log("Stripe secret key:", process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // You can set the apiVersion if needed:
  //apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("Received request body:", req.body);
    const { line_items } = req.body;
    if (!line_items || !Array.isArray(line_items)) {
      console.error("Invalid or missing line_items:", req.body);
      return res.status(400).json({ error: "Missing or invalid line_items" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
    });

    console.log("Created Stripe session:", session.id);
    return res.status(200).json({ id: session.id });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ error: error.message });
  }
}
