import type { Metadata } from "next";
import "./globals.css";

// Remove the Inter font import that's causing issues
// Use system fonts instead

export const metadata: Metadata = {
  title: "MCQ Generator - Create Custom Multiple Choice Questions",
  description: "Generate random multiple choice questions from any topic or prompt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <footer className="bg-gray-100 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} MCQ Generator. All rights reserved.</p>
            <p className="mt-2">Generate multiple choice questions on any topic instantly.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
