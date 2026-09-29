import { Bookmark, LogIn, LogOut, Menu, Monitor, Plus, Search, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Form, Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  function handleNavigate(path: string) {
    setOpen(false);
    navigate(path);
  }

  async function handleLogout() {
    await logout();
    handleNavigate('/recipes');
  }

  return (
    <nav className="bg-background/70 sticky top-4 z-50 mx-auto mt-4 flex w-[calc(100%-1rem)] max-w-6xl items-center justify-between gap-3 rounded-5xl border border-orange-50/50 px-4 py-2.5 shadow-sm shadow-orange-900/20 backdrop-blur-xl sm:px-5">
      {/* Logo  */}

      <Link to="/" className="group shrink-0 text-base font-bold tracking-tight transition-colors">
        RECIPES<span className="text-primary transition-colors group-hover:text-foreground">-X</span>
      </Link>

      {/* Desktop actions */}
      <div className="hidden shrink-0 items-center gap-2 md:flex">
        {user ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/recipes/mine')}>
              <UserRound />
              My Recipes
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate('/recipes/new')}>
              <Plus />
              Add Recipe
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate('/recipes/bookmarks')}>
              <Bookmark />
              Bookmarks
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate('/sessions')}>
              <Monitor />
              Sessions
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate('/recipes/trash')}>
              <Trash2 />
              Trash
            </Button>

            <Button variant="outline" size="sm" onClick={logout} disabled={isLoggingOut}>
              <LogOut />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              <LogIn />
              Login
            </Button>

            <Button size="sm" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      <div className="ml-auto md:hidden">
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

            <div className="flex flex-1 flex-col gap-4 px-4">
              <Form method="get" action="/recipes" onSubmit={() => setOpen(false)}>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input name="search" placeholder="Search recipes..." className="pl-9" />
                </div>
              </Form>

              {user ? (
                <div className="flex flex-1 flex-col justify-between pt-1 pb-8">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      className="justify-start"
                      onClick={() => handleNavigate('/recipes/mine')}
                    >
                      <UserRound />
                      My Recipes
                    </Button>

                    <Button
                      variant="secondary"
                      className="justify-start"
                      onClick={() => handleNavigate('/recipes/bookmarks')}
                    >
                      <Bookmark />
                      Bookmarks
                    </Button>

                    <Button variant="secondary" className="justify-start" onClick={() => handleNavigate('/sessions')}>
                      <Monitor />
                      Sessions
                    </Button>

                    <Button
                      variant="secondary"
                      className="justify-start"
                      onClick={() => handleNavigate('/recipes/trash')}
                    >
                      <Trash2 />
                      Trash
                    </Button>

                    <Button
                      variant="secondary"
                      className="justify-start"
                      onClick={() => handleNavigate('/recipes/new')}
                    >
                      <Plus />
                      Add Recipe
                    </Button>
                  </div>

                  <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
                    <LogOut />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-end gap-2 pb-8">
                  <Button onClick={() => handleNavigate('/login')}>
                    <LogIn />
                    Login
                  </Button>

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
