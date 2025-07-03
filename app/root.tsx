import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
} from "react-router";


import type { Route } from "./+types/root";
import "./app.css";
import { Toaster } from "./components/ui/sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '~/data-domain/query-client';

import { unstable_addTransitionType as addTransitionType, startTransition } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div>
      <nav className="bg-gray-100 dark:bg-gray-900 p-4 flex gap-4 shadow">
        <NavLink
        prefetch="viewport"
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-900 dark:text-blue-200 font-bold underline"
              : "text-blue-700 dark:text-blue-400 hover:underline"
          }
          onClick={(event) => {
            startTransition(() => {
            // check if active via aria-current="page"
            if (event.currentTarget.getAttribute("aria-current") === "page") {
              addTransitionType("slide-out");
            } else {
                addTransitionType("slide-in");
              }
            });
          }}
        >
          Home
        </NavLink>
        <NavLink
          prefetch="viewport"
          to="/test1"
          className={({ isActive }) =>
            isActive
              ? "text-blue-900 dark:text-blue-200 font-bold underline"
              : "text-blue-700 dark:text-blue-400 hover:underline"
          }
          onClick={(event) => {
            startTransition(() => {
            // check if active via aria-current="page"
            if (event.currentTarget.getAttribute("aria-current") === "page") {
              addTransitionType("slide-out");
            } else {
                addTransitionType("slide-in");
              }
            });
          }}
        >
          Test 1
        </NavLink>
        <NavLink
          prefetch="viewport"
          to="/test2"
          className={({ isActive }) =>
            isActive
              ? "text-blue-900 dark:text-blue-200 font-bold underline"
              : "text-blue-700 dark:text-blue-400 hover:underline"
          }
          onClick={(event) => {
            startTransition(() => {
            // check if active via aria-current="page"
            if (event.currentTarget.getAttribute("aria-current") === "page") {
              addTransitionType("slide-out");
            } else {
                addTransitionType("slide-in");
              }
            });
          }}
        >
          Test 2
        </NavLink>
        <NavLink
          prefetch="viewport"
          to="/test3"
          className={({ isActive }) =>
            isActive
              ? "text-blue-900 dark:text-blue-200 font-bold underline"
              : "text-blue-700 dark:text-blue-400 hover:underline"
          }
          onClick={(event) => {
            startTransition(() => {
            // check if active via aria-current="page"
            if (event.currentTarget.getAttribute("aria-current") === "page") {
              addTransitionType("slide-out");
            } else {
              addTransitionType("slide-in");
              }
            });
          }}
        >
          Test 3
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
