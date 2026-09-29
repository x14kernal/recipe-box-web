import { ExternalLink, GitBranch } from 'lucide-react';
import { Outlet } from 'react-router';

import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:py-20 md:py-24">
        <Outlet />
      </main>

      <footer className="bg-muted/30 border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:gap-6 sm:py-12 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium">Recipes-X</p>
            <p className="text-muted-foreground text-sm">Built with React, TypeScript & modern web tools.</p>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href="https://x.com/x14kernal"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="size-4" />
              Follow me on X
            </a>

            <a
              href="https://github.com/x14kernal/recipe-box-web"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <GitBranch className="size-4" />
              View the frontend code
            </a>

            <a
              href="https://github.com/x14kernal/recipe-box-api"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <GitBranch className="size-4" />
              View the backend code
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
