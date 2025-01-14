import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Header = () => (
  <header className="w-full bg-white dark:bg-gray-900">
        <h1 className="text-xl font-bold tracking-wide text-gray-800 dark:text-zinc-200" style={{ fontFamily: "'Jersey 15'" }}>
          My Dear <span className="font-bold bg-[#b4d7d9] bg-clip-text text-transparent">IA</span>
        </h1>

        {/* Centered logo */}
        <div className="absolute left-1/2 -translate-x-1/2 size-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="size-full"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8E1E8" />
                <stop offset="100%" stopColor="#E8B4BC" />
              </linearGradient>
            </defs>

            <circle cx="100" cy="100" r="90" fill="url(#logoGradient)" opacity="0.9"/>
            <circle cx="100" cy="100" r="60" fill="#E8B4BC" opacity="0.8"/>
            <circle cx="100" cy="100" r="35" fill="#F8E1E8"/>

            <path
              d="M100 40 L120 60 L100 80 L80 60 Z"
              fill="#B4D7D9"
              opacity="0.8"
            />

            <path
              d="M65 100 Q100 130 135 100"
              stroke="#B4D7D9"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M65 90 Q100 120 135 90"
              stroke="#B4D7D9"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            <circle cx="70" cy="85" r="5" fill="#B4D7D9"/>
            <circle cx="130" cy="85" r="5" fill="#B4D7D9"/>
          </svg>
        </div>

        {/* Empty div to balance the layout */}
        <div className="w-[68px]"></div>
  </header>
);

export default Header;
