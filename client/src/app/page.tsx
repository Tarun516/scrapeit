"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChevronDown,
  BugIcon as Spider,
  Database,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Login from "@/components/ui/Auth/Login";
import Signup from "@/components/ui/Auth/Signup";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-09-13%20000014-gOZQpucS8e1wxJk8mgsn6WkgiLYY8H.png"
            alt="Digital miner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            ApeScrape
          </h1>
          <p className="text-2xl mb-8 text-orange-200">
            We scrape data for your LLMs by the LLMs
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            Get Started
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center textD-orange-500">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-red-500 border">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-300">
                <Spider className="mr-2 text-red-500" /> Web Scraping
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Efficient and accurate data extraction from websites.
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-red-500 border">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-300">
                <Database className="mr-2 text-red-500" /> Vector Embeddings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Transform your data into meaningful vector representations.
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-red-500 border">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-300">
                <BarChart3 className="mr-2 text-red-500" /> Data Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              Gain insights from your scraped data with our analysis tools.
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        {/* Toggle between Login and Signup */}
        {hasAccount ? (
          <div>
            <Login />
            <p className="text-center text-gray-400 mt-4">
              Don't have an account?{" "}
              <button
                className="text-orange-500 hover:text-orange-600"
                onClick={() => setHasAccount(false)}
              >
                Sign up
              </button>
            </p>
          </div>
        ) : (
          <div>
            <Signup onSuccess={() => router.push("/dashboard")} />
            <p className="text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <button
                className="text-orange-500 hover:text-orange-600"
                onClick={() => setHasAccount(true)}
              >
                Log in
              </button>
            </p>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-red-900 to-orange-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Revolutionize Your Web Scraping?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join the ranks of data-driven companies using ApeScrape
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-xs bg-gray-800 border-gray-700 text-white"
            />
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md transition duration-300">
              Get Early Access
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-orange-500">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <Card className="bg-gray-800 border-red-500 border">
            <CardHeader>
              <CardTitle
                className="flex justify-between items-center cursor-pointer text-orange-300"
                onClick={() => setIsOpen(!isOpen)}
              >
                What is web scraping?
                <ChevronDown
                  className={`transform transition-transform ${
                    isOpen ? "rotate-180" : ""
                  } text-red-500`}
                />
              </CardTitle>
            </CardHeader>
            {isOpen && (
              <CardContent className="text-gray-300">
                Web scraping is the automated process of extracting data from
                websites. It allows you to collect large amounts of data quickly
                and efficiently, which can then be used for various purposes
                such as market research, price monitoring, or training AI
                models.
              </CardContent>
            )}
          </Card>
          {/* Add more FAQ items as needed */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 border-t border-red-500">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Scrapit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
