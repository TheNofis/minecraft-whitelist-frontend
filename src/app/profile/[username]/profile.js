"use client";

import { useState, useEffect, useContext } from "react";
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
} from "lucide-react";

import { toast } from "react-toastify";

import Image from "next/image";

import ServiceUser from "@/services/Service.User";
import STATUS from "@/http/status";

import { LanguageContext } from "@/context/LanguageContext";
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

function ProfileCard({ user }) {
  const { translations } = useContext(LanguageContext);

  return (
    <Card className="relative overflow-hidden">
      {user?.role !== "unverified" && (
        <div className="absolute top-0 right-0 p-4">
          <Badge variant="outline" className="bg-primary/10">
            <Signal className="mr-1 h-4 w-4" />
            {user?.stats?.ping?.average}
          </Badge>
        </div>
      )}

      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <Image
              src={`https://minotar.net/armor/bust/${user?.profile?.avatar || user?.profile?.username}/100.png`}
              alt={user?.profile?.avatar || user?.profile?.username}
              width={100}
              height={100}
              className="rounded-lg transition-transform group-hover:scale-105"
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
                {translations.playtime}:{" "}
                {user?.stats?.online_activity?.total || 0}
              </Badge>
              <Badge variant="outline" className="bg-primary/10">
                <Users className="mr-1 h-4 w-4" />
                {translations.sessions}:{" "}
                {user?.stats?.session_count?.total || 0}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, icon: Icon, color, stats }) {
  const { translations } = useContext(LanguageContext);

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
              {stats?.total?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {translations.monthly}
            </div>
            <div className="text-2xl font-bold">
              {stats?.monthly?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {translations.weekly}
            </div>
            <div className="text-2xl font-bold">
              {stats?.weekly?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserProfile({ username }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();
  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    if (!translations?.state_loaded) return;
    ServiceUser.getProfile(username).then((json) => {
      if (json.status === STATUS.SUCCESS) {
        setUser(json?.content);
        return setIsLoading(false);
      } else {
        toast.error(translations?.toast_messages[json?.code || 200]);
        router.push("/profile");
      }
    });
  }, [translations]);

  return (
    !isLoading && (
      <main className="container max-w-4xl mx-auto py-10">
        <div className="grid gap-6">
          <ProfileCard user={user} />
          {user?.role !== "unverified" && (
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                  title={translations.playerkills}
                  icon={Sword}
                  color="text-red-500"
                  stats={user?.stats?.player_kill}
                />
                <StatCard
                  title={translations.deaths}
                  icon={Skull}
                  color="text-pink-500"
                  stats={user?.stats?.player_death}
                />
                <StatCard
                  title={translations.mobkills}
                  icon={Ghost}
                  color="text-purple-500"
                  stats={user?.stats?.mob_kill}
                />
                <StatCard
                  title={translations.playtime}
                  icon={Timer}
                  color="text-green-500"
                  stats={user?.stats?.online_activity}
                />
                <StatCard
                  title={translations.sessions}
                  icon={Users}
                  color="text-blue-500"
                  stats={user?.stats?.session_count}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    )
  );
}
