import { Form, Link, useNavigate } from 'react-router';
import { Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-4 z-50 mx-auto mt-4 flex w-[calc(100%-1rem)] max-w-5xl items-center gap-4 rounded-2xl border border-orange-200/50 bg-background/70 px-5 py-3 shadow-sm shadow-orange-900/5 backdrop-blur-md dark:border-orange-900/30">
      <Link to="/" className="shrink-0 font-black tracking-tight">
        RECIPES-X
      </Link>

      {/* Desktop search */}
      <Form method="get" action="/recipes" className="hidden flex-1 sm:flex">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input name="search" placeholder="Search recipes..." className="pl-9" />
        </div>
      </Form>

      {/* Desktop actions */}
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        {user ? (
          <>
            <Button variant="ghost" onClick={() => navigate('/recipes/new')}>
              Add Recipe
            </Button>

            <Button variant="outline" onClick={logout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out..' : 'Logout'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>

            <Button onClick={() => navigate('/register')}>Register</Button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      <div className="ml-auto sm:hidden">
        <Sheet>
          <SheetTrigger
            className="inline-flex size-9 items-center justify-center rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Recipes-X</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4">
              <Form method="get" action="/recipes">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input name="search" placeholder="Search recipes..." className="pl-9" />
                </div>
              </Form>

              {user ? (
                <>
                  <Button onClick={() => navigate('/recipes/new')}>Add Recipe</Button>

                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Login
                  </Button>

                  <Button onClick={() => navigate('/register')}>Register</Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
