import Image from "next/image";
import Link from "next/link";

interface Feature {
  title: string;
  description: string;
  icon: string; // path to public icon or URL
}

interface CTAButton {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary";
}

const features: Feature[] = [
  {
    title: "Multi-Step Form",
    description:
      "Create multi-step forms with validation, autosave, and localStorage support.",
    icon: "/icons/form.svg",
  },
  {
    title: "Admin Dashboard",
    description:
      "View submissions, export CSV, and display charts with Recharts.",
    icon: "/icons/dashboard.svg",
  },
  {
    title: "API & DB Ready",
    description: "Prisma + PostgreSQL integration for scalable backends.",
    icon: "/icons/api.svg",
  },
];

const ctaButtons: CTAButton[] = [
  { label: "Try the Form", href: "/form", variant: "primary" },
  {
    label: "View on GitHub",
    href: "https://github.com/vanheaven-ui/my-multistep-form",
    external: true,
    variant: "secondary",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 sm:py-32 bg-zinc-50 dark:bg-zinc-900 font-sans">
      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black dark:text-white">
          Multi-Step Form Starter
        </h1>
        <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 mb-8 max-w-2xl">
          Quickly launch forms, dashboards, and APIs with a reusable, modular
          Next.js starter template. Fully themeable, responsive, and ready for
          production.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start mb-12">
          {ctaButtons.map((btn, idx) => {
            const baseClasses = "px-6 py-3 rounded-lg font-semibold transition";
            const primary =
              "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-800";
            const secondary =
              "border border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800";

            return btn.external ? (
              <a
                key={idx}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClasses} ${
                  btn.variant === "primary" ? primary : secondary
                }`}
              >
                {btn.label}
              </a>
            ) : (
              <Link
                key={idx}
                href={btn.href}
                className={`${baseClasses} ${
                  btn.variant === "primary" ? primary : secondary
                }`}
              >
                {btn.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-6 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-md transition"
          >
            <Image
              src={feature.icon}
              alt={feature.title}
              width={48}
              height={48}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
              {feature.title}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
