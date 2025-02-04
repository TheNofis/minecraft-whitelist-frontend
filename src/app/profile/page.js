"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { useEffect, useState, useContext } from "react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-toastify";

import ServiceUser from "@/services/Service.User";
import ServiceAuth from "@/services/Service.Auth";
import STATUS from "@/http/status";
import Link from "next/link";

import { LanguageContext } from "@/context/LanguageContext";

function IframeMap({ translations }) {
  return (
    <Card className="mt-10">
      <CardContent>
        <iframe
          src="https://mineandtee.fun/maps/vanila"
          className="w-full h-[400px] mt-6"
        />
        <Link
          href="https://mineandtee.fun/maps/vanila"
          target="_blank"
          className="text-muted-foreground hover:underline mt-2"
        >
          {translations.opennewpage}
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const { translations } = useContext(LanguageContext);

  const [user, setUser] = useState({
    profile: {
      username: "nameless tee",
      register_ts: Date.now(),
    },
    role: "unverified",
  });

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

  return (
    !isLoading && (
      <main className="container max-w-2xl mx-auto py-10">
        <Card>
          <CardHeader>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner className="w-20 h-20" />
              </div>
            ) : (
              <ProfileHeader
                username={user?.profile?.username}
                role={user?.role !== "unverified" && user?.role}
                registeredAt={user?.profile?.register_ts}
                isVerified={user?.role !== "unverified"}
                translations={translations}
              />
            )}
          </CardHeader>
        </Card>
        <IframeMap translations={translations} />
      </main>
    )
  );
}

function ProfileHeader({
  username,
  role,
  registeredAt,
  isVerified,
  translations,
}) {
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    ServiceAuth.verify().then((json) => {
      if (json.status !== STATUS.SUCCESS) router.push("/login");
      else setIsLoaded(true);
    });
  }, []);

  return (
    isLoaded && (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-4xl text-primary-foreground">
            {username?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {username}
              {role && (
                <span className="text-muted-foreground ml-2 text-lg">
                  ({role})
                </span>
              )}
              <p className="text-muted-foreground text-lg">
                {format(new Date(registeredAt), "dd MMM yyyy")}
              </p>
            </h2>
            <Badge
              variant={isVerified ? "success" : "destructive"}
              className="mt-1"
            >
              {isVerified ? (
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
          </div>
        </div>
      </div>
    )
  );
}
