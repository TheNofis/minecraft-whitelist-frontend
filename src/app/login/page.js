"use client";

import { useEffect, useState, useContext } from "react";
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

import { LanguageContext } from "@/context/LanguageContext";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    if (!translations?.state_loaded) return;
    ServiceAuth.verify().then((json) => {
      if (json.status === STATUS.SUCCESS) router.push("/profile");
      else setIsLoaded(true);
    });
  }, [translations]);

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

      if (json.status === STATUS.ERROR)
        return toast.error(translations?.toast_messages[json?.code || 200]);
      toast.success(translations?.toast_messages[json?.code || 100]);

      setCookie("Authorization", `Bearer ${json?.content?.token}`);
      router.push("/profile");
    });
  }

  return (
    isLoaded && (
      <main className="container flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>{translations.login_title}</CardTitle>
            <CardDescription>
              <span>{translations.login_description}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">{translations.enterusername}</Label>
                <Input id="identifier" name="identifier" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{translations.password}</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? translations.login_inprogress
                  : translations.loginbutton}
              </Button>

              <div className="text-sm flex items-center justify-center flex-col ">
                <span>{translations.noaccount}</span>
                <Link href="/register" className="text-primary hover:underline">
                  {translations.registerbutton}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  );
}
