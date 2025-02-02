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
import { Check } from "@/components/icons/check";

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
          <CardTitle>
            {isLoading ? "Email verifying" : "Email verifed"}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? "Please wait while your Email is verified"
              : "Your Email has been successfully confirmed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {isLoading ? (
              <Spinner className="w-20 h-20" />
            ) : (
              <Check
                className="w-20 h-20 flex justify-center"
                color="#31C48D"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
