import Link from 'next/link';

const mainLinks = [
  { label: 'Go to Home', href: '/' },
  { label: 'Try the Form', href: '/form' },
  { label: 'View Dashboard', href: '/dashboard' },
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-900 font-sans">
      <main className="flex-grow max-w-6xl w-full flex flex-col items-center justify-center pt-24 pb-16">
        {/* Main Content Card - Consistent with Home Page Styling */}
        <div className="bg-white dark:bg-zinc-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-4xl text-center border border-zinc-100 dark:border-zinc-700">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-black dark:text-white leading-tight">
            📚 Docs Page
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8 max-w-3xl mx-auto">
            This is a placeholder page for your **Multi-Step Form Starter
            documentation**. You can build out your technical guides here.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {mainLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition duration-200 shadow-md border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
