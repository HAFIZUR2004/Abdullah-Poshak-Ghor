import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

type AuthShellProps = {
  title: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  switchHref,
  switchLabel,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen w-full bg-white/30">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl md:grid md:grid-cols-2">
          {/* Close button */}
          <Link
            href="/"
            aria-label="Close"
            className="absolute right-6 top-6 z-20 grid h-10 w-10 place-items-center rounded-full bg-primary-gold text-text-white shadow-md transition-all hover:bg-dark-bronze hover:scale-110"
          >
            <X className="h-5 w-5" />
          </Link>

          {/* Left welcome panel - gradient, NO image */}
          <section className="gradient-blue relative flex flex-col justify-center items-center gap-5 overflow-hidden px-10 py-16 text-text-white md:px-14 md:py-20">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/5" />

            <Image
              src="https://i.ibb.co.com/FkcbNmzJ/Logo-2-removebg-preview.webp"
              alt="Sareng Furniture"
              width={56}
              height={56}
              className="relative h-14 w-14 object-contain"
            />

            <h2 className="relative text-4xl font-semibold">Welcome</h2>

            <p className="relative max-w-sm text-sm leading-relaxed text-text-white/85">
              Sareng is a fast-growing furniture brand with customers and
              connoisseurs around the globe.
            </p>

            <Link
              href={switchHref}
              className="relative mt-2 w-fit border border-text-white/70 px-10 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-text-white hover:text-primary-blue"
            >
              {switchLabel}
            </Link>
          </section>

          {/* Right form panel - pure white, NO image */}
          <section className="flex flex-col justify-center bg-white px-8 py-16 md:px-14 md:py-20">
            <h1 className="mb-8 text-center text-2xl font-semibold text-text-dark">
              {title}
            </h1>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
