
// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Received request method:", req.method);

  // Only allow POST requests.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("Request body:", req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if a customer with the same email already exists.
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });
    if (existingCustomer) {
      console.error("Email already in use:", email);
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password.
    const passwordHash = await bcrypt.hash(password, 10);
    if (!passwordHash) {
      throw new Error("Password hashing failed");
    }

    // Create the customer.
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    console.log("Customer created successfully:", customer);
    return res.status(201).json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    });
  } catch (error) {
    const err = error as Error;
    const errorMessage = err && err.message ? err.message : "An unknown error occurred";
    console.error("Signup error:", error);
    return res.status(500).json({ error: errorMessage });
  }
}
