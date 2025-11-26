"use client";
import React from "react";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterProps {
  companyName?: string;
  year?: number;
  links?: FooterLink[];
  className?: string;
}

export default function Footer({
  companyName = "Multi-Step Form Starter",
  year = new Date().getFullYear(),
  links = [],
  className = "",
}: FooterProps) {
  return (
    <footer
      className={`w-full py-6 px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      <div>
        &copy; {year} {companyName}. All rights reserved.
      </div>
      {links.length > 0 && (
        <div className="flex gap-4 mt-2 sm:mt-0">
          {links.map((link, idx) =>
            link.external ? (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {link.label}
              </a>
            ) : (
              <a key={idx} href={link.href} className="hover:underline">
                {link.label}
              </a>
            ),
          )}
        </div>
      )}
    </footer>
  );
}
