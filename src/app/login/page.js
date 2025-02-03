"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "react-toastify";

import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    ServiceAuth.verify().then((json) => {
      if (json.status === STATUS.SUCCESS) router.push("/profile");
      else setIsLoaded(true);
    });
  }, []);

  async function onSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      identifier: formData.get("identifier"),
      password: formData.get("password"),
    };

    ServiceAuth.login(data).then((json) => {
      setIsLoading(false);

      if (json.status === STATUS.ERROR) return toast.error(json?.message);
      toast.success("Авторизация прошла успешно!");

      setCookie("Authorization", `Bearer ${json?.content?.token}`);
      router.push("/profile");
    });
  }

  return (
    isLoaded && (
      <main className="container flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>Авторизация</CardTitle>
            <CardDescription>
              <span>Пожалуйста, войдите в свой аккаунт</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Имя пользователя или Почта</Label>
                <Input id="identifier" name="identifier" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Авторизация..." : "Войти"}
              </Button>

              <div className="text-sm flex items-center justify-center flex-col ">
                <span>У вас нет аккаунта?</span>
                <Link href="/register" className="text-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  );
}
