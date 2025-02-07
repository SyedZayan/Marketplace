// pages/about.tsx
"use client";
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import React, { useEffect } from 'react';

const About: React.FC = () => {
  useEffect(() => {
    // Cast window as any to avoid TypeScript errors when accessing Swiper
    const SwiperLib = (window as any).Swiper;
    if (SwiperLib) {
      // Initialize the thumbnail Swiper
      const swiper = new SwiperLib('.mySwiper', {
        loop: true,
        spaceBetween: -10,
        slidesPerView: 3,
        watchSlidesProgress: true,
      });

      // Initialize the main Swiper instance and link the thumbnail swiper
      const swiper2 = new SwiperLib('.mySwiper2', {
        loop: true,
        spaceBetween: 32,
        thumbs: {
          swiper: swiper,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });

      // Optional: Initialize another Swiper instance (e.g. for a team slider)
      const teamswiper = new SwiperLib('.teamswiper', {
        slidesPerView: 1,
        spaceBetween: 32,
        centeredSlides: false,
        slidesPerGroupSkip: 1,
        grabCursor: true,
        loop: true,
        keyboard: {
          enabled: true,
        },
        breakpoints: {
          769: {
            slidesPerView: 2,
            slidesPerGroup: 1,
          },
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        scrollbar: {
          el: '.swiper-scrollbar',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
      });
    }
  }, []);

  return (
    <div>
      <Head>
        <title>About - Rental Car Co.</title>
        <meta
          name="description"
          content="Learn more about Rental Car Co.—our mission, values, and commitment to outstanding car rental experiences."
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"
        />
        <style jsx global>{`
          .swiper-wrapper {
            height: max-content !important;
            width: max-content;
          }
          .swiper-button-next,
          .swiper-button-prev {
            top: 25%;
            z-index: 1000;
          }
          .swiper-button-next {
            right: 0 !important;
          }
          .swiper-button-prev {
            left: 0 !important;
          }
          .swiper-button-prev:after,
          .swiper-rtl .swiper-button-next:after {
            content: "" !important;
          }
          .mySwiper {
            max-width: 320px !important;
            margin: 0 auto !important;
          }
          .swiper-button-next:after,
          .swiper-rtl .swiper-button-prev:after {
            content: "" !important;
          }
          .teamswiper .swiper-wrapper {
            height: max-content !important;
            padding-bottom: 64px !important;
          }
          .teamswiper .swiper-horizontal > .swiper-scrollbar,
          .teamswiper .swiper-scrollbar.swiper-scrollbar-horizontal {
            max-width: 140px !important;
            height: 3px !important;
            bottom: 25px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          .teamswiper .swiper-pagination-fraction {
            bottom: 0 !important;
            padding-top: 16px !important;
          }
          .teamswiper .swiper-scrollbar-drag {
            background: rgb(79, 70, 229);
          }
          .teamswiper .swiper-button-prev {
            top: 93% !important;
            left: 35% !important;
            z-index: 100 !important;
          }
          .teamswiper .swiper-button-next {
            top: 93% !important;
            right: 35% !important;
            z-index: 100 !important;
          }
          .teamswiper .swiper-button-next svg,
          .teamswiper .swiper-button-prev svg {
            width: 24px !important;
            height: 24px !important;
          }
        `}</style>
      </Head>

      {/* Main Content */}
      <main className="bg-gray-50">
        <section className="py-14 lg:py-24 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-5">
              About Rental Car Co.
            </h1>
            <p className="text-lg text-gray-500 mb-9 max-w-2xl mx-auto">
              We offer reliable, flexible, and affordable car rentals with no hidden fees. Our mission is to deliver outstanding customer service and a seamless rental experience.
            </p>
          </div>
        </section>

        <section className="py-14 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-9">
            <div className="flex justify-center items-center">
              <img
            src="https://platform.cstatic-images.com/large/in/v2/stock_photos/e74b9fc3-5d68-4746-a779-91b3d7f7bf0b/662ad619-8301-4c97-bb4e-0d7775cde919.png"
            alt="Our Fleet"
                className="object-cover rounded-lg w-full"
              />
            </div>
            <div className="lg:pl-20 flex items-center">
              <div>
                <h2 className="font-bold text-4xl lg:text-5xl text-black mb-9">
                  Your Journey, Our Commitment
                </h2>
                <p className="text-xl leading-8 text-gray-500 max-w-2xl">
                  Since 2005, Rental Car Co. has been dedicated to providing the best car rental experience. With a diverse fleet and top-notch customer service, we ensure every journey is smooth and enjoyable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl text-center font-bold text-gray-900 mb-14">
              Our Impact in Numbers
            </h2>
            <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
              <div className="lg:w-1/3 bg-white p-6 rounded-2xl shadow-md">
                <div className="flex gap-5">
                  <div className="text-2xl font-bold text-indigo-600">240%</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Growth</h4>
                    <p className="text-xs text-gray-500">
                      Rapid expansion and high customer satisfaction.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 bg-white p-6 rounded-2xl shadow-md">
                <div className="flex gap-5">
                  <div className="text-2xl font-bold text-indigo-600">175+</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Team Members</h4>
                    <p className="text-xs text-gray-500">
                      A dedicated team committed to excellence.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 bg-white p-6 rounded-2xl shadow-md">
                <div className="flex gap-5">
                  <div className="text-2xl font-bold text-indigo-600">625+</div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Cars Rented</h4>
                    <p className="text-xs text-gray-500">
                      Thousands of satisfied customers worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-14 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl text-center font-bold text-gray-900 mb-14">
              What Our Customers Say
            </h2>
            {/* Reviews Slider */}
            <div className="swiper mySwiper2">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="max-w-xl mx-auto">
                    <p className="text-lg text-gray-500 leading-8 text-center">
                      Rental Car Co. made my trip hassle-free with their excellent service.
                    </p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="max-w-xl mx-auto">
                    <p className="text-lg text-gray-500 leading-8 text-center">
                      I trust Rental Car Co. for all my travel needs—efficient and reliable.
                    </p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="max-w-xl mx-auto">
                    <p className="text-lg text-gray-500 leading-8 text-center">
                      Exceptional customer support and a great fleet of vehicles. Highly recommended!
                    </p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="max-w-xl mx-auto">
                    <p className="text-lg text-gray-500 leading-8 text-center">
                      Outstanding service and friendly staff – my experience was top-notch!
                    </p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="max-w-xl mx-auto">
                    <p className="text-lg text-gray-500 leading-8 text-center">
                      Affordable and reliable – I'd recommend Rental Car Co. to everyone!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Thumbnails Slider */}
            <div className="swiper mySwiper mt-8">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <img
                    src="https://pagedone.io/asset/uploads/1704349534.png"
                    alt="Emily"
                    className="mx-auto rounded-full border w-16 h-16 object-cover"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://pagedone.io/asset/uploads/1704349572.png"
                    alt="Ethan"
                    className="mx-auto rounded-full border w-16 h-16 object-cover"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://pagedone.io/asset/uploads/1704349514.png"
                    alt="Olivia"
                    className="mx-auto rounded-full border w-16 h-16 object-cover"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://via.placeholder.com/64"
                    alt="Customer 4"
                    className="mx-auto rounded-full border w-16 h-16 object-cover"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://via.placeholder.com/64"
                    alt="Customer 5"
                    className="mx-auto rounded-full border w-16 h-16 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simplified Footer with Secondary Navbar */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex justify-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/economy" className="text-gray-600 hover:text-gray-900">
              Economy
            </Link>
            <Link href="/luxury" className="text-gray-600 hover:text-gray-900">
              Luxury
            </Link>
          </nav>
        </div>
        <div className="bg-gray-100 py-4">
          <p className="text-center text-sm text-gray-500">
            © Rental Car Co. 2024, All rights reserved.
          </p>
        </div>
      </footer>

      <Script
        src="https://cdn.jsdelivr.net/npm/pagedone@1.1.2/src/js/pagedone.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
    </div>
  );
};

export default About;
