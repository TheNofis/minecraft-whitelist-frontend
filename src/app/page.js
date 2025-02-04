"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";
import Image from "next/image";

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
        <Card className="w-full max-w-[400px]">
          <CardHeader className="text-center">
            <CardTitle>
              <Image
                src="/logo.webp"
                alt="logo"
                width={120}
                height={120}
                className="mx-auto rounded-full shadow-lg mb-10"
              />
              <span>Mine And Tee</span>
            </CardTitle>
            <CardDescription>
              <span>Приватный minecraft сервер</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/register" className="w-full">
              <Button className="w-full">Регистрация</Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Авторизация
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  );
}
