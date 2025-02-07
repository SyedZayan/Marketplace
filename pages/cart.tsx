// pages/cart.tsx
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

interface CartItem {
  id: number;
  productName: string;
  image: string;
  pricePerDay: number;
  rentalDuration: number; // optional: set on product page if needed
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  dropoffTime: string;
  rentalDays: number;
  totalPrice: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Cart: NextPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  // Load cart items and user data from localStorage on mount.
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedItems: CartItem[] = JSON.parse(storedCart);
        setCartItems(parsedItems);
      } catch (err) {
        console.error("Error parsing cart:", err);
      }
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }
  }, []);

  // Helper function to update a cart item and recalc computed values.
  const updateCartItem = (
    id: number,
    field: keyof CartItem,
    value: string
  ) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (updatedItem.pickupTime && updatedItem.dropoffTime) {
          const pickupDate = new Date(updatedItem.pickupTime);
          const dropoffDate = new Date(updatedItem.dropoffTime);
          const diffTime = dropoffDate.getTime() - pickupDate.getTime();
          const days = diffTime > 0 ? Math.ceil(diffTime / (1000 * 3600 * 24)) : 0;
          updatedItem.rentalDays = days;
          updatedItem.totalPrice = days * updatedItem.pricePerDay;
        } else {
          updatedItem.rentalDays = 0;
          updatedItem.totalPrice = 0;
        }
        return updatedItem;
      }
      return item;
    });
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // Recalculate rentalDays and totalPrice when pickup/dropoff times change.
  useEffect(() => {
    const timesDep = cartItems.map(item => item.pickupTime + item.dropoffTime).join();
    if (timesDep) {
      const recalculatedItems = cartItems.map((item) => {
        if (item.pickupTime && item.dropoffTime) {
          const pickupDate = new Date(item.pickupTime);
          const dropoffDate = new Date(item.dropoffTime);
          const diffTime = dropoffDate.getTime() - pickupDate.getTime();
          const days = diffTime > 0 ? Math.ceil(diffTime / (1000 * 3600 * 24)) : 0;
          return { ...item, rentalDays: days, totalPrice: days * item.pricePerDay };
        }
        return item;
      });
      if (JSON.stringify(recalculatedItems) !== JSON.stringify(cartItems)) {
        setCartItems(recalculatedItems);
        localStorage.setItem("cart", JSON.stringify(recalculatedItems));
      }
    }
  }, [cartItems.map(item => item.pickupTime + item.dropoffTime).join()]);

  // Handler to remove an item from the cart.
  const removeItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Handler to create an order for each cart item and then create a Stripe Checkout session.
  const handleCheckout = async () => {
    // If the user is not logged in, prompt them to sign in.
    if (!user) {
      setCheckoutError("Please sign in to proceed with checkout.");
      return;
    }

    // Validate that every required field is filled for every cart item.
    for (const item of cartItems) {
      if (
        !item.pickupLocation ||
        !item.dropoffLocation ||
        !item.pickupTime ||
        !item.dropoffTime
      ) {
        setCheckoutError("Please fill in all required fields for every item before proceeding to checkout.");
        return;
      }
    }
    setCheckoutError("");

    // Save each order to your database.
    // (This example assumes each cart item results in one order.)
    try {
      for (const item of cartItems) {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: user.id,
            pickupLocation: item.pickupLocation,
            dropoffLocation: item.dropoffLocation,
            pickupTime: item.pickupTime,
            dropoffTime: item.dropoffTime,
            rentalDays: item.rentalDays,
            totalPrice: item.totalPrice,
            status: "pending" // or you can let the API default it
          }),
        });
        if (!orderRes.ok) {
          const errorText = await orderRes.text();
          console.error("Error saving order:", errorText);
          setCheckoutError("Error saving order. Please try again.");
          return;
        }
      }
    } catch (err) {
      console.error("Error saving order:", err);
      setCheckoutError("Error saving order. Please try again.");
      return;
    }

    // Build line items for Stripe from cartItems.
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.productName },
        unit_amount: Math.round(item.pricePerDay * 100),
      },
      quantity: item.rentalDays > 0 ? item.rentalDays : 1,
    }));

    try {
      const res = await fetch("/api/stripe/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_items }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response from Stripe session API:", errorText);
        setCheckoutError("Failed to create checkout session.");
        return;
      }

      const data = await res.json();
      const sessionId = data.id;
      if (!sessionId) {
        console.error("No session ID returned:", data);
        setCheckoutError("Failed to create checkout session.");
        return;
      }
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Stripe redirect error:", error.message);
          setCheckoutError(error.message || "Stripe redirect error.");
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError("An error occurred during checkout.");
    }
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Rental Cart
        </h2>
        {user && (
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Hello, {user.name}! Please ensure all fields are filled.
          </p>
        )}
        {checkoutError && (
          <p className="mt-4 text-red-500">{checkoutError}</p>
        )}
        {cartItems.length === 0 ? (
          <p className="mt-6 text-center text-lg text-gray-700 dark:text-gray-300">
            Your cart is empty.
          </p>
        ) : (
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl space-y-6"
              >
                {/* Product Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    {/* Larger Car Image */}
                    <div className="shrink-0 md:order-1">
                      <img
                        className="h-32 w-32 object-cover rounded"
                        src={item.image}
                        alt={item.productName}
                      />
                    </div>
                    {/* Rental Car Details and Pickup/Dropoff Fields */}
                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        {item.productName}
                      </h3>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {item.productName.includes("Luxury")
                          ? "Luxury rental car"
                          : "Economy rental car"}
                      </p>
                      <div className="mt-4 space-y-4">
                        {/* Pickup Location */}
                        <div>
                          <label
                            htmlFor={`pickupLocation-${item.id}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Pickup Location
                          </label>
                          <input
                            type="text"
                            id={`pickupLocation-${item.id}`}
                            value={item.pickupLocation}
                            onChange={(e) =>
                              updateCartItem(item.id, "pickupLocation", e.target.value)
                            }
                            placeholder="Enter pickup location"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        {/* Dropoff Location */}
                        <div>
                          <label
                            htmlFor={`dropoffLocation-${item.id}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Dropoff Location
                          </label>
                          <input
                            type="text"
                            id={`dropoffLocation-${item.id}`}
                            value={item.dropoffLocation}
                            onChange={(e) =>
                              updateCartItem(item.id, "dropoffLocation", e.target.value)
                            }
                            placeholder="Enter dropoff location"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        {/* Pickup Date & Time */}
                        <div>
                          <label
                            htmlFor={`pickupTime-${item.id}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Pickup Date &amp; Time
                          </label>
                          <input
                            type="datetime-local"
                            id={`pickupTime-${item.id}`}
                            value={item.pickupTime}
                            onChange={(e) =>
                              updateCartItem(item.id, "pickupTime", e.target.value)
                            }
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        {/* Dropoff Date & Time */}
                        <div>
                          <label
                            htmlFor={`dropoffTime-${item.id}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Dropoff Date &amp; Time
                          </label>
                          <input
                            type="datetime-local"
                            id={`dropoffTime-${item.id}`}
                            value={item.dropoffTime}
                            onChange={(e) =>
                              updateCartItem(item.id, "dropoffTime", e.target.value)
                            }
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Price and Delete Button */}
                    <div className="text-end md:order-3 md:w-32">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        ${item.pricePerDay}/day
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-2 inline-flex items-center rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                {/* Order Summary for this item */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                  <div className="space-y-4">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Order Summary
                    </p>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="text-base font-bold text-gray-900 dark:text-white">
                        Rental Days
                      </dt>
                      <dd className="text-base font-bold text-gray-900 dark:text-white">
                        {item.rentalDays} {item.rentalDays === 1 ? "day" : "days"}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                      <dt className="text-base font-bold text-gray-900 dark:text-white">
                        Total
                      </dt>
                      <dd className="text-base font-bold text-gray-900 dark:text-white">
                        ${item.totalPrice}
                      </dd>
                    </dl>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="mt-4 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  >
                    Proceed to Checkout
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      or
                    </span>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 underline hover:no-underline dark:text-indigo-500"
                    >
                      Continue Shopping
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
