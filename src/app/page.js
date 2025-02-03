"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    ServiceAuth.verify().then((json) => {
      if (json.status === STATUS.SUCCESS) router.push("/profile");
      else setIsLoaded(true);
    });
  }, []);

  return (
    isLoaded && (
      <main className="container flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-[350px] space-y-6 text-center">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <div className="flex flex-col gap-4">
            <Link href="/register" className="w-full">
              <Button className="w-full">Register</Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  );
}
