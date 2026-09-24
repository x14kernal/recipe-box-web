import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import { ExternalLink, GitBranch } from 'lucide-react';

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-18">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Recipes-X</p>
            <p className="text-sm text-muted-foreground">Built with React, TypeScript & modern web tools.</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <a
              href="https://x.com/x14kernal"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              Follow me on X
            </a>

            <a
              href="https://github.com/x14kernal/recipe-box-web"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <GitBranch className="size-4" />
              View the frontend code
            </a>

            <a
              href="https://github.com/x14kernal/recipe-box-api"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
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
