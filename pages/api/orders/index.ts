// pages/api/orders/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const {
    customerId,
    pickupLocation,
    dropoffLocation,
    pickupTime,
    dropoffTime,
    rentalDays,
    totalPrice,
    status, // Optional field from request
  } = req.body;

  // Validate required fields (status is optional)
  if (
    !customerId ||
    !pickupLocation ||
    !dropoffLocation ||
    !pickupTime ||
    !dropoffTime ||
    !rentalDays ||
    !totalPrice
  ) {
    return res.status(400).json({ error: "Missing required order data" });
  }

  // Convert numeric values
  const parsedValues = {
    customerId: Number(customerId),
    rentalDays: Number(rentalDays),
    totalPrice: Number(totalPrice),
  };

  // Validate numeric conversions
  if (Object.values(parsedValues).some(isNaN)) {
    return res.status(400).json({
      error: "Invalid numeric values in customerId, rentalDays, or totalPrice",
    });
  }

  try {
    const order = await prisma.order.create({
      data: {
        customerId: parsedValues.customerId,
        pickupLocation,
        dropoffLocation,
        pickupTime: new Date(pickupTime),
        dropoffTime: new Date(dropoffTime),
        rentalDays: parsedValues.rentalDays,
        totalPrice: parsedValues.totalPrice,
        status: status || "pending", // Proper type-safe assignment
      },
    });
    return res.status(201).json(order);
  } catch (error: any) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      error: error.message || "Order creation failed",
      prismaError: error.code, // For debugging
    });
  }
}