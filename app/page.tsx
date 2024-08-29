"use client";

import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import ParticlesBackground from "@/components/particles-back";

import Image from "next/image";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between p-2 bg-white dark:bg-[#393b3e] shadow-md z-10">
        <div className="flex items-center space-x-2">
          <Link href="/" aria-label="Homepage">
            <Image
              src="/logo.svg"
              alt="Your Logo"
              width={30}
              height={30}
              priority
            />
          </Link>
          <h1 className="text-lg font-extrabold tracking-tight">DreamProf</h1>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button
            className="text-gray-900 dark:text-gray-100 focus:outline-none"
            aria-label="Toggle Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <ModeToggle />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
        </div>
      </nav>

      <div
        id="home"
        className="flex flex-col items-center justify-center min-h-screen pt-20 md:pt-24 p-4 text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Spend more time on what matters,
            <br />
            let our chatbot handle the rest.
          </h1>

          <p className="text-lg mb-8 max-w-2xl">
            Get accurate and insightful information about your professors with
            our chatbot. Simply ask questions to receive detailed feedback,
            ratings, and advice from fellow students, helping you make informed
            decisions about your courses and instructors.
          </p>
          
          <RegisterLink postLoginRedirectURL="/dashboard">
              <Button>Go to Dashboard</Button>
          </RegisterLink>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#393b3e] text-white py-1 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">
            © {new Date().getFullYear()} DreamProf. All rights reserved.
          </p>
          <div className="mt-4">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="text-gray-400 hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
