"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";

import ServiceUser from "@/services/Service.User";
import STATUS from "@/http/status";
import { toast } from "react-toastify";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

function ProfileHeader({ username, role, registeredAt, isVerified }) {
  return (
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
              Дата регистрации: {format(new Date(registeredAt), "dd MMM yyyy")}
            </p>
          </h2>
          <Badge
            variant={isVerified ? "success" : "destructive"}
            className="mt-1"
          >
            {isVerified ? (
              <>
                <CheckCircle className="mr-1 h-4 w-4" /> Verified
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-4 w-4" /> Not Verified
              </>
            )}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [user, setUser] = useState({
    profile: {
      username: "",
      register_ts: 0,
    },
    role: "",
  });

  useEffect(() => {
    ServiceUser.profile().then((json) => {
      setIsLoading(false);
      if (json.status === STATUS.ERROR) {
        toast.error(json.message);
        deleteCookie("Authorization");
        router.push("/login");
      }

      if (json.status === STATUS.SUCCESS) {
        setUser(json.content);
      }
    });
  }, []);

  return (
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
            />
          )}
        </CardHeader>
      </Card>
    </main>
  );
}

// <CardContent>
//   <form onSubmit={onSubmit} className="space-y-4">
//     <div className="space-y-2">
//       <Label htmlFor="username">Username</Label>
//       <Input
//         id="username"
//         name="username"
//         defaultValue={user.username}
//         required
//       />
//     </div>
//     <div className="space-y-2">
//       <Label htmlFor="gameUsername">Game Username</Label>
//       <Input
//         id="gameUsername"
//         name="gameUsername"
//         defaultValue={user.gameUsername}
//       />
//     </div>
//     <div className="space-y-2">
//       <Label htmlFor="email">Email</Label>
//       <Input
//         id="email"
//         name="email"
//         type="email"
//         defaultValue={user.email}
//         required
//       />
//     </div>
//     <Button type="submit" className="w-full" disabled={isLoading}>
//       {isLoading ? "Updating..." : "Update Profile"}
//     </Button>
//   </form>
// </CardContent>
