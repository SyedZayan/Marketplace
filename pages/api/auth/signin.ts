// pages/api/auth/signin.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // using bcryptjs

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Signin request method:", req.method);

  // Only allow POST requests.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    // Find customer by email.
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords using bcryptjs.
    const passwordMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // In a real application, you would create a session or return a JWT.
    // For simplicity, we return the customer details.
    return res.status(200).json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    });
  } catch (error) {
    // Ensure we always return a valid object.
    const errorMessage =
      error && typeof error === "object" && (error as any).message
        ? (error as any).message
        : "An unknown error occurred";
    console.error("Signin error:", error);
    return res.status(500).json({ error: errorMessage });
  }
}
