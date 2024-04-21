import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isPortal, setIsPortal] = useState(false);

  useEffect(() => {
    setIsPortal(window.location.pathname === '/portal');
  }, []);

  return (
    <header className="flex gap-5 self-stretch px-20 py-5 w-full bg-white shadow-sm max-md:flex-wrap max-md:px-5 max-md:max-w-full justify-between items-center">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/40d3f5bef4c1c0b3f854c02c193b2327339f8d33c78a1fc7c32de52512aa2fb5?apiKey=4cd313e52a54443281316348492870be&"
        alt=""
        className="max-w-full w-[180px] -mb-1"
      />
      <div className="flex gap-8 items-center">
        <nav className="flex gap-8 justify-between my-auto text-xl whitespace-nowrap">
          <Link
            href="/"
            className={`${
              !isPortal
                ? 'text-indigo-600 font-semibold'
                : 'text-zinc-400 font-medium'
            }`}
          >
            Forms
          </Link>
          <Link
            href="/portal"
            className={`${
              isPortal
                ? 'text-indigo-600 font-semibold'
                : 'text-zinc-400 font-medium'
            }`}
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex gap-1 ml-1">
          <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800"></div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cd70ac8adfcef8cea219ee03e79c8772b66ef174307aaf1e03b5a119a899d568?apiKey=4cd313e52a54443281316348492870be"
            alt=""
            className="shrink-0 my-auto w-4 aspect-square"
          />
        </div>
      </div>
    </header>
  );
}
