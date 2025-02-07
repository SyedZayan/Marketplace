// pages/index.tsx
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      {/* Hero Section */}
      <div className="mx-auto grid max-w-screen-xl px-4 pb-8 md:grid-cols-12 lg:gap-12 lg:pb-16 xl:gap-0">
        <div className="content-center justify-self-start md:col-span-7 md:text-start">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight dark:text-white md:max-w-2xl md:text-5xl xl:text-6xl">
            Experience the Thrill of Driving
            <br />
            Top-Quality Cars for Every Journey
          </h1>
          <p className="mb-4 max-w-2xl text-gray-500 dark:text-gray-400 md:mb-12 md:text-lg lg:mb-5 lg:text-xl">
            Discover our selection of luxury and economy cars available for rental at unbeatable prices.
          </p>
          <a
            href="/luxury"
            className="inline-block rounded-lg bg-indigo-600 px-6 py-3.5 text-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          >
            Explore Cars
          </a>
        </div>
        <div className="hidden md:col-span-5 md:mt-0 md:flex">
          <img
            className="object-cover rounded-lg"
            src="https://stat.overdrive.in/wp-content/uploads/2020/07/2020-Audi-RS7-Sportback.jpg"
            alt="Luxury Car"
          />
        </div>
      </div>

      {/* Category/Brand Logos Section */}
      <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-8 text-gray-500 dark:text-gray-400 sm:grid-cols-3 sm:gap-12 lg:grid-cols-6 px-4">
        <a href="/luxury" className="flex items-center justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVAVMpQb5FMhZKCxGfYcgRoVsQLZc5-eJpO47L-KGkOXo0PrKRwNyVMKyUjEhtJ11nCK0&usqp=CAU"
            alt="Luxury"
            className="h-10"
          />
        </a>
        <a href="/economy" className="flex items-center justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkQODHtDH-mHghC1Fsbg2Oy99bxA6ls2MPZQ&s"
            alt="Economy"
            className="h-10"
          />
        </a>
        {/* You can add additional category images as needed */}
      </div>
    </section>
  );
};

export default Home;
