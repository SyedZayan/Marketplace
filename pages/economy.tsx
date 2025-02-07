import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Economy: NextPage = () => {
  const router = useRouter();
  const [duration, setDuration] = useState("1");

  const handleRentNow = () => {
    const productData = {
      id: 1, // You may generate a unique ID or use product ID from your backend
      productName: "Economy Hatchback",
      image:
        "https://stat.overdrive.in/wp-content/uploads/2020/07/2020-Audi-RS7-Sportback.jpg",
      pricePerDay: 75,
      rentalDuration: Number(duration),
      pickupLocation: "",
      dropoffLocation: "",
      pickupTime: "",
      dropoffTime: "",
    };

    // Save the product data in localStorage as an array (for multiple items, later)
    localStorage.setItem("cart", JSON.stringify([productData]));
    router.push("/cart");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start mx-4 py-12">
      <div className="flex bg-white rounded-lg shadow dark:bg-gray-800 flex-col md:flex-row">
        {/* Economy Car Image */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center">
          <img
            src="https://stat.overdrive.in/wp-content/uploads/2020/07/2020-Audi-RS7-Sportback.jpg"
            alt="Economy Car"
            className="object-cover w-full h-48 md:h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        </div>

        {/* Product Details */}
        <form
          className="flex-auto p-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleRentNow();
          }}
        >
          <div className="flex flex-wrap">
            <h1 className="flex-auto text-xl font-semibold dark:text-gray-50">
              Economy Hatchback
            </h1>
            <div className="text-xl font-semibold text-gray-500 dark:text-gray-300">
              $75.00/day
            </div>
            <div className="flex-none w-full mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
              Available
            </div>
          </div>

          {/* Rental Duration Input */}
          <div className="flex items-center mt-4 mb-6">
            <label
              htmlFor="rental-duration-economy"
              className="mr-2 text-gray-700 dark:text-gray-300"
            >
              Rental Duration (days):
            </label>
            <input
              id="rental-duration-economy"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-20 rounded border-gray-300 p-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Rent Now Button */}
          <div className="flex mb-4 text-sm font-medium">
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              Rent now
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-300">
            Special rates available for extended rentals.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Economy;
