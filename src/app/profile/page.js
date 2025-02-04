"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Sword,
  Timer,
  Skull,
  Signal,
  Users,
  Ghost,
  DoorOpen,
} from "lucide-react";
import { toast } from "react-toastify";

import Image from "next/image";

import ServiceUser from "@/services/Service.User";
import STATUS from "@/http/status";

import { LanguageContext } from "@/context/LanguageContext";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

function OnlineIndicator({ isOnline }) {
  return (
    <div className="absolute -top-1 -right-1 p-1">
      <div className="relative">
        <div
          className={`h-4 w-4 rounded-full ${
            isOnline
              ? "bg-green-500 after:absolute after:inset-0 after:rounded-full after:bg-green-500 after:animate-ping after:opacity-75"
              : "bg-red-500"
          }`}
        />
      </div>
    </div>
  );
}

function ProfileCard({ user, translations, router }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Badge variant="outline" className="bg-primary/10">
          <Signal className="mr-1 h-4 w-4" />
          {user?.stats?.ping?.average}
        </Badge>
      </div>
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Image
              src={`https://crafatar.com/avatars/${user?.uuid || "8667ba71b85a4004af54457a9734eed7"}`}
              alt={user?.profile?.username}
              width={100}
              height={100}
              className="rounded-lg border-2 border-primary/10"
            />
            <OnlineIndicator isOnline={user.stats?.online} />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{user?.profile?.username}</h2>
              <Badge variant="outline" className="bg-primary/10">
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={
                  user?.role !== "unverified" && user?.role !== "ban"
                    ? "success"
                    : "destructive"
                }
              >
                {user?.role !== "unverified" ? (
                  <>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    {translations.verified}
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-4 w-4" />
                    {translations.unverified}
                  </>
                )}
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                <Timer className="mr-1 h-4 w-4" />
                {translations.playtime}: {user?.stats?.online_activity?.total}
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                <Users className="mr-1 h-4 w-4" />
                {translations.sessions}: {user?.stats?.session_count?.total}
              </Badge>
            </div>

            <Button
              variant="destructive"
              className="right"
              onClick={() => logout(router)}
            >
              <DoorOpen className="mr-2 h-4 w-4" />
              {translations.logoutbutton}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, icon: Icon, color, stats, translations }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {translations.alltime}
            </div>
            <div className="text-2xl font-bold">
              {stats?.total?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {translations.monthly}
            </div>
            <div className="text-2xl font-bold">
              {stats?.monthly?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {translations.weekly}
            </div>
            <div className="text-2xl font-bold">
              {stats?.weekly?.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const logout = (router) => {
  deleteCookie("Authorization");
  router.push("/login");
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { translations } = useContext(LanguageContext);

  const router = useRouter();

  useEffect(() => {
    if (!translations?.toast_messages?.length) return;

    ServiceUser.profile().then((json) => {
      if (json.status === STATUS.SUCCESS) {
        setUser(json?.content);
        return setIsLoading(false);
      } else {
        toast.error(translations?.toast_messages[json?.code || 0]);
        deleteCookie("Authorization");
        return router.push("/login");
      }
    });
  }, [translations]);

  const [user, setUser] = useState();
  return (
    !isLoading && (
      <main className="container max-w-4xl mx-auto py-10">
        <div className="grid gap-6">
          <ProfileCard
            user={user}
            translations={translations}
            router={router}
          />
          {user?.role !== "unverified" && (
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                  title={translations.playerkills}
                  icon={Sword}
                  color="text-red-500"
                  stats={user?.stats?.player_kill}
                  translations={translations}
                />
                <StatCard
                  title={translations.deaths}
                  icon={Skull}
                  color="text-pink-500"
                  stats={user?.stats?.player_death}
                  translations={translations}
                />
                <StatCard
                  title={translations.mobkills}
                  icon={Ghost}
                  color="text-purple-500"
                  stats={user?.stats?.mob_kill}
                  translations={translations}
                />
                <StatCard
                  title={translations.playtime}
                  icon={Timer}
                  color="text-green-500"
                  stats={user?.stats?.online_activity}
                  translations={translations}
                />
                <StatCard
                  title={translations.sessions}
                  icon={Users}
                  color="text-blue-500"
                  stats={user?.stats?.session_count}
                  translations={translations}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    )
  );
}
