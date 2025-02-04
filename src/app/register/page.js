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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";

const VerifyModal = ({ email, isOpen, setEmailVerifyModal }) => {
  const sendMain = () => {
    ServiceAuth.sendEmail(email)
      .then((json) => {
        if (json.status === STATUS.ERROR) return toast.error(json?.message);

        toast.success(`На электронную почту ${email} отправлено письмо!`, {
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
      title="Подтверждение почты"
      onClose={() => {
        setEmailVerifyModal(false);
      }}
    >
      <span>
        Сейчас на вашу почту будет отправлено письмо с ссылкой на подтверждение
        электнонной почты
      </span>

      <span>
        Отправка письма может занять некоторое время.
        <br />
        Если вы не получили письмо, проверьте папку спам
      </span>

      <Button className="mt-5" onClick={sendMain}>
        Отправить письмо еще раз
      </Button>
    </Modal>
  );
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [emailVerifyModal, setEmailVerifyModal] = useState(false);

  const [email, setEmail] = useState("");

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
      username: formData.get("username"),
      ingamename: formData.get("gameUsername"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (data.password !== data.confirmPassword) {
      toast.error("Пароли не совпадают!");
      setIsLoading(false);
      return;
    }

    ServiceAuth.register(data).then((json) => {
      setIsLoading(false);
      if (json.status === STATUS.ERROR) return toast.error(json?.message);

      setEmail(data.email);
      setEmailVerifyModal(true);
    });
  }

  return (
    isLoaded && (
      <main className="container flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Создайте свой аккаунт чтобы начать
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerifyModal
              email={email}
              isOpen={emailVerifyModal}
              setEmailVerifyModal={setEmailVerifyModal}
            />
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input id="username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gameUsername">Имя в игре DDNet</Label>
                <Input id="gameUsername" name="gameUsername" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Почта</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
              </Button>

              <div className="text-sm flex items-center justify-center flex-col ">
                <span>У вас уже есть аккаунт?</span>
                <Link href="/login" className="text-primary hover:underline">
                  Войти
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  );
}
