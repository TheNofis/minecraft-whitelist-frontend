"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";

import { LanguageContext } from "@/context/LanguageContext";

const VerifyModal = ({ email, isOpen, setEmailVerifyModal, translations }) => {
  const sendMain = () => {
    ServiceAuth.sendEmail(email)
      .then((json) => {
        if (json.status === STATUS.ERROR)
          return toast.error(translations?.toast_messages[json?.code || 200]);

        toast.success(translations.emailcodesend.replace("{email}", email), {
          autoClose: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      className="flex flex-col gap-5"
      title={translations.emailverify_title}
      onClose={() => {
        setEmailVerifyModal(false);
      }}
    >
      <span>{translations.email_title}</span>

      <span className="text-sm text-muted-foreground">
        {translations.email_description}
      </span>

      <Button onClick={sendMain}>{translations.email_resend}</Button>
    </Modal>
  );
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [emailVerifyModal, setEmailVerifyModal] = useState(true);

  const [email, setEmail] = useState("");

  const router = useRouter();

  const { translations } = useContext(LanguageContext);

  useEffect(() => {
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
      username: formData.get("username"),
      ingamename: formData.get("gameUsername"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (data.password !== data.confirmPassword) {
      toast.error(translations.passwords_dont_match);
      return setIsLoading(false);
    }

    ServiceAuth.register(data).then((json) => {
      setIsLoading(false);
      if (json.status !== STATUS.SUCCESS)
        return toast.error(translations.toast_messages[json?.code || 200]);

      setEmail(data.email);
      setEmailVerifyModal(true);
    });
  }

  return (
    isLoaded && (
      <main className="container flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>{translations.register_title}</CardTitle>
            <CardDescription>
              {translations.register_description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerifyModal
              email={email}
              isOpen={emailVerifyModal}
              setEmailVerifyModal={setEmailVerifyModal}
              translations={translations}
            />
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{translations.username}</Label>
                <Input
                  id="username"
                  name="username"
                  pattern="[a-zA-Z0-9_]*"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gameUsername">{translations.ingamename}</Label>
                <Input id="gameUsername" name="gameUsername" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{translations.email}</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{translations.password}</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {translations.confirmpassword}
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? translations.register_inprogress
                  : translations.registerbutton}
              </Button>

              <div className="text-sm flex items-center justify-center flex-col ">
                <span>{translations.alreadyregistered}</span>
                <Link href="/login" className="text-primary hover:underline">
                  {translations.loginbutton}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  );
}
