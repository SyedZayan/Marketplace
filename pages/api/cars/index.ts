// pages/api/cars/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch available cars (e.g., where availabilityStatus is true)
      const cars = await prisma.car.findMany({
        where: { availabilityStatus: true },
      });
      res.status(200).json(cars); // Respond with JSON
    } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: 'Error fetching cars' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
