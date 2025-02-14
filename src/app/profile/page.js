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
  Server,
  User,
} from "lucide-react";
import { MapViewer } from "@/components/ui/map-viewer";
import { SkinPickerModal } from "@/components/ui/skin-picker-modal";

import { toast } from "react-toastify";

import Image from "next/image";

import ServiceUser from "@/services/Service.User";
import ServiceStatistics from "@/services/Service.Statistics";
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

function ProfileCard({ user, setIsSkinModalOpen }) {
  const { translations } = useContext(LanguageContext);
  const router = useRouter();

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
          <div className="relative group">
            <Image
              src={`https://minotar.net/armor/bust/${user?.profile?.avatar || user?.profile?.username}/100.png`}
              alt={user?.profile?.avatar || user?.profile?.username}
              width={100}
              height={100}
              className="rounded-lg transition-transform group-hover:scale-105"
            />
            <button
              onClick={() => setIsSkinModalOpen(true)}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            >
              <User className="w-6 h-6" />
            </button>
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

function ServerInfoCard({ serverInfo }) {
  const { translations } = useContext(LanguageContext);

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base">
              {translations.serverinformation}
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-green-500">
            {translations.serveronline}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {translations.servername}
              </div>
              <div className="text-2xl font-bold">Mine And Tee</div>
              <div className="text-sm text-muted-foreground mt-1">Vanila</div>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {translations.serveraddress}
              </div>
              <div className="flex items-center gap-2">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-base font-semibold">
                  play.mineandtee.fun
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() =>
                    navigator.clipboard.writeText("play.mineandtee.fun")
                  }
                >
                  {translations.servercopy}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {translations.serveronline}
              </div>
              <div className="text-2xl font-bold">
                {serverInfo?.online_players || 0}/200
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {translations.serverversion}
              </div>
              <div className="text-2xl font-bold">1.21.4</div>
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
  const [serverInfo, setServerInfo] = useState({});
  const [user, setUser] = useState();
  const { translations } = useContext(LanguageContext);

  const router = useRouter();

  useEffect(() => {
    ServiceUser.profile().then((json) => {
      if (json.status === STATUS.SUCCESS) {
        setUser(json?.content);
        return setIsLoading(false);
      } else {
        toast.error(translations?.toast_messages[json?.code || 200]);
        deleteCookie("Authorization");
        return router.push("/login");
      }
    });

    ServiceStatistics.server().then((json) => {
      if (json.status === STATUS.SUCCESS) return setServerInfo(json?.content);
    });
  }, [translations]);

  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);

  return (
    !isLoading && (
      <main className="container max-w-4xl mx-auto py-10">
        <div className="grid gap-6">
          <ProfileCard user={user} setIsSkinModalOpen={setIsSkinModalOpen} />
          {user?.role !== "unverified" && (
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ServerInfoCard serverInfo={serverInfo} />
                <MapViewer />
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

        <SkinPickerModal
          isOpen={isSkinModalOpen}
          onClose={() => setIsSkinModalOpen(false)}
          currentUsername={user?.profile?.avatar || user?.profile?.username}
        />
      </main>
    )
  );
}
