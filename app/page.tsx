import Image from 'next/image';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface CTAButton {
  label: string;
  href: string;
  external?: boolean;
  variant?: 'primary' | 'secondary';
}

const features: Feature[] = [
  {
    title: 'Multi-Step Form',
    description:
      'Create multi-step forms with validation, autosave, and localStorage support.',
    icon: '/icons/form.svg',
  },
  {
    title: 'Admin Dashboard',
    description:
      'View submissions, export CSV, and display charts with Recharts.',
    icon: '/icons/dashboard.svg',
  },
  {
    title: 'API & DB Ready',
    description: 'Prisma + PostgreSQL integration for scalable backends.',
    icon: '/icons/api.svg',
  },
];

const ctaButtons: CTAButton[] = [
  { label: 'Try the Form', href: '/form', variant: 'primary' },
  { label: 'View Dashboard', href: '/dashboard', variant: 'secondary' },
  {
    label: 'View on GitHub',
    href: 'https://github.com/vanheaven-ui/my-multistep-form',
    external: true,
    variant: 'secondary',
  },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-900 font-sans">
      <div className="max-w-6xl w-full flex flex-col items-center">
        {/* Hero Section - Centered Card Style */}
        <div className="bg-white dark:bg-zinc-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-4xl text-center mb-16 border border-zinc-100 dark:border-zinc-700">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-black dark:text-white leading-tight">
            Multi-Step Form Starter
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 mb-10 max-w-3xl mx-auto">
            Quickly launch forms, dashboards, and APIs with a reusable, modular
            <strong><span className="ml-1">Next.js starter template</span></strong>. Fully themeable,
            responsive, and ready for production.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {ctaButtons.map((btn, idx) => {
              const baseClasses =
                'px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition duration-200 shadow-lg';
              const primary =
                'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-800 ring-4 ring-blue-200 dark:ring-blue-900/50';
              const secondary =
                'border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-md';

              const classes = btn.variant === 'primary' ? primary : secondary;

              return btn.external ? (
                <a
                  key={idx}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${baseClasses} ${classes}`}
                >
                  {btn.label}
                </a>
              ) : (
                <Link
                  key={idx}
                  href={btn.href}
                  className={`${baseClasses} ${classes}`}
                >
                  {btn.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Feature Cards - Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-8 bg-white dark:bg-zinc-800 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] border-t-4 border-blue-500 dark:border-blue-400"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={36}
                  height={36}
                  className="w-9 h-9"
                />
              </div>
              <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                {feature.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 text-center text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
