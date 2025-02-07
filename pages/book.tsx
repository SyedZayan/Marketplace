// pages/book.tsx
import { useState } from 'react';

export default function Book() {
  const [form, setForm] = useState({
    customerId: '', // This would typically come from an authenticated user
    carId: '',
    pickupLocation: '',
    returnLocation: '',
    rentalPeriod: '',
    totalCost: 0,
    status: 'Pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log('Order created:', data);
      // Redirect to order confirmation or user dashboard
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <h1>Book a Car</h1>
      <form onSubmit={handleSubmit}>
        <input name="customerId" placeholder="Customer ID" onChange={handleChange} required />
        <input name="carId" placeholder="Car ID" onChange={handleChange} required />
        <input name="pickupLocation" placeholder="Pickup Location" onChange={handleChange} required />
        <input name="returnLocation" placeholder="Return Location" onChange={handleChange} required />
        <input name="rentalPeriod" placeholder="Rental Period" onChange={handleChange} required />
        <input name="totalCost" type="number" placeholder="Total Cost" onChange={handleChange} required />
        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
}
