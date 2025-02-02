"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spinner } from "@/components/ui/spinner";
import { Check } from "@/components/ui/check";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          {isLoading ? (
            <CardTitle>Email verifying</CardTitle>
          ) : (
            <CardTitle>Email verifed</CardTitle>
          )}
          <CardDescription>
            Please wait while your Email is verified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {isLoading ? (
              <Spinner className="w-20 h-20" />
            ) : (
              <Check className="w-20 h-20 flex justify-center color-green" />
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
