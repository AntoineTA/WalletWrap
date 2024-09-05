"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const AuthWidget = () => {
  const { getIsAuth } = useSession();
  const [isPending, setIsPending] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>();

  useEffect(() => {
    (async () => {
      setIsPending(true);
      setIsAuthenticated(await getIsAuth());
      setIsPending(false);
    })();
  }, []);

  const handleClick = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (isPending) {
    return <Skeleton className="w-24 h-10" />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/budget">My Budget</Link>
        </Button>
        <Button onClick={handleClick} variant="secondary">
          Logout
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Signup</Link>
        </Button>
      </div>
    );
  }
};
