import { Menu, Search } from 'lucide-react';
import { Form, Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  function handleNavigate(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <nav className="bg-background/70 sticky top-4 z-50 mx-auto mt-4 flex w-[calc(100%-1rem)] max-w-5xl items-center gap-4 rounded-2xl border border-orange-200/50 px-5 py-3 shadow-sm shadow-orange-900/5 backdrop-blur-md dark:border-orange-900/30">
      <Link to="/" className="shrink-0 font-black tracking-tight">
        RECIPES-X
      </Link>

      {/* Desktop search */}
      <Form method="get" action="/recipes" className="hidden flex-1 sm:flex">
        <div className="relative w-full max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

          <Input name="search" placeholder="Search recipes..." className="pl-9" />
        </div>
      </Form>

      {/* Desktop actions */}
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        {user ? (
          <>
            <Button variant="ghost" onClick={() => navigate('/recipes/mine')}>
              My Recipes
            </Button>

            <Button variant="ghost" onClick={() => navigate('/recipes/trash')}>
              Trashed Recipes
            </Button>

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
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md border shadow-xs"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Recipes-X</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 flex-1">
              <Form method="get" action="/recipes">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

                  <Input name="search" placeholder="Search recipes..." className="pl-9" />
                </div>
              </Form>

              {user ? (
                <div className="flex flex-col flex-1 justify-between pt-1 pb-8">
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" onClick={() => handleNavigate('/recipes/mine')}>
                      My Recipes
                    </Button>
                    <Button variant="secondary" onClick={() => handleNavigate('/recipes/trash')}>
                      Trashed Recipes
                    </Button>
                    <Button variant="secondary" onClick={() => handleNavigate('/recipes/new')}>
                      Add Recipe
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={async () => {
                      await logout();
                      handleNavigate('/recipes');
                    }}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? 'Logging out..' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col justify-end flex-1 pb-8 gap-2">
                  <Button onClick={() => handleNavigate('/login')}>Login</Button>

                  <Button variant="secondary" onClick={() => handleNavigate('/register')}>
                    Register
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
