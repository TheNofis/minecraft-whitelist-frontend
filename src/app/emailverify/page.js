"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spinner } from "@/components/ui/spinner";

import { CheckCircle, XCircle } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";
import { setCookie } from "cookies-next";

export default function EmailVerifyPage() {
  return (
    <Suspense>
      <EmailVerifyPageContent />
    </Suspense>
  );
}

export function EmailVerifyPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const emailCode = searchParams?.get("emailCode");
    ServiceAuth.emailVerify(emailCode).then((json) => {
      setIsLoading(false);
      if (json.status === STATUS.ERROR) {
        setStatus("error");
        return toast.error(json?.message);
      }

      if (json.status === STATUS.SUCCESS) {
        setStatus("success");
        toast.success(json?.message);
        setCookie("Authorization", `Bearer ${json?.content?.token}`);
        return router.push("/profile");
      }
    });
  }, []);

  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>
            {isLoading
              ? "Подтверждение почты"
              : status === "success"
                ? "Успешно"
                : "Ошибка"}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? "Пожалуйста, подождите, пока мы подтвердим вашу почту"
              : status === "success"
                ? "Почта успешно подтверждена"
                : "Ошибка подтверждения почты"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {isLoading ? (
              <Spinner className="w-20 h-20" />
            ) : status === "success" ? (
              <CheckCircle className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
