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
import { Suspense, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";

import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";
import { setCookie } from "cookies-next";

import { LanguageContext } from "@/context/LanguageContext";

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

  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    if (!translations?.state_loaded || !searchParams) return;
    const emailCode = searchParams?.get("emailCode");
    if (
      !emailCode ||
      emailCode == null ||
      !translations ||
      translations == null
    )
      return;

    ServiceAuth.emailVerify(emailCode).then((json) => {
      setIsLoading(false);
      if (json.status === STATUS.ERROR) {
        setStatus("error");
        return toast.error(translations?.toast_messages[json?.code || 200]);
      }

      if (json.status === STATUS.SUCCESS) {
        setStatus("success");
        toast.success(translations?.toast_messages[json?.code || 100]);
        setCookie("Authorization", `Bearer ${json?.content?.token}`);
        return router.push("/profile");
      }
    });
  }, [translations]);

  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>
            {isLoading
              ? translations.emailverify_title
              : status === "success"
                ? translations.success
                : translations.error}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? translations.emailverify_description
              : status === "success"
                ? translations.emailverify_success
                : translations.emailverify_error}
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
