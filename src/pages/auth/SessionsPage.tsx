import { Laptop, LogOut, Mail, Monitor, Smartphone, UserRound } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { useSessions } from '@/hooks/useSessions';
import { useState } from 'react';
import { session as sessionApi } from '@/api/session';
import { PageHeader } from '@/components/PageHeader';

function getDeviceIcon(userAgent: string | null) {
  if (/mobile|android|iphone|ipad/i.test(userAgent ?? '')) {
    return Smartphone;
  }

  if (/mac|windows|linux/i.test(userAgent ?? '')) {
    return Laptop;
  }

  return Monitor;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function SessionsPage() {
  const { user } = useAuth();
  const { loading, error, sessionsList, refetch } = useSessions();

  const [loggingOutId, setLoggingOutId] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout(id: string) {
    setLoggingOutId(id);
    setLogoutError(null);

    try {
      await sessionApi.logout(id);
      await refetch();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Failed to sign out');
    } finally {
      setLoggingOutId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Active sessions"
        description="Manage the devices currently signed in to your account."
      />

      {/* Error */}
      {(error || logoutError) && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          {error && <AlertDescription>{error}</AlertDescription>}
          {logoutError && <AlertDescription>{logoutError}</AlertDescription>}
        </Alert>
      )}

      {/* Account */}
      {!loading && user && (
        <Card className="border border-accent/30 bg-accent/5 shadow-xs rounded-3xl">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold shadow-sm">
              {(user.displayName ?? user.username)[0].toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <UserRound className="text-primary size-4 shrink-0" />

                <h2 className="truncate font-semibold">{user.displayName ?? user.username}</h2>
              </div>

              <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>@{user.username}</span>

                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {user.email}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="border-border/70 rounded-3xl">
              <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="size-10 rounded-xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sessionsList.length === 0 && (
        <Card className="border-border/70 rounded-3xl">
          <CardContent className="text-muted-foreground flex flex-col items-center py-12 text-center">
            <Monitor className="mb-3 size-8" />

            <p className="text-foreground font-medium">No active sessions</p>

            <p className="mt-1 text-sm">There are no active sessions on your account.</p>
          </CardContent>
        </Card>
      )}

      {/* Sessions */}
      {!loading && sessionsList.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="font-semibold">Your devices</h2>

            <p className="text-muted-foreground text-sm">
              {sessionsList.length} {sessionsList.length === 1 ? 'active session' : 'active sessions'}
            </p>
          </div>

          <div className="space-y-3">
            {sessionsList.map((session) => {
              const DeviceIcon = getDeviceIcon(session.userAgent);
              const isLoggingOut = loggingOutId === session.id;

              return (
                <Card
                  key={session.id}
                  className="border-accent/25 bg-accent/5 rounded-3xl shadow-sm transition-colors hover:bg-accent/10"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    {/* Device */}
                    <div className="bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center rounded-xl">
                      <DeviceIcon className="size-5" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium">{session.userAgent || 'Unknown device'}</p>

                        {session.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground mt-1 text-xs">Last active {formatDate(session.lastSeenAt)}</p>
                    </div>

                    {/* Action */}
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={loggingOutId !== null}
                        onClick={() => handleLogout(session.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <LogOut />
                        <span className="hidden sm:inline">{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
