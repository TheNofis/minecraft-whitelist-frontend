"use client";

import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import ServiceAdmin from "@/services/Service.Admin";
import STATUS from "@/http/status";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import { LanguageContext } from "@/context/LanguageContext";

const SecretEmail = ({ email }) => {
  const [state, setState] = useState(false);
  return (
    <div className="cursor-pointer" onClick={() => setState((prev) => !prev)}>
      {state ? (
        email
      ) : (
        <Badge variant="outline" className="px-20 py-2">
          SECRET
        </Badge>
      )}
    </div>
  );
};

export default function AdminPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    if (!translations?.state_loaded) return;
    ServiceAdmin.users().then((json) => {
      if (json.status === STATUS.SUCCESS) {
        setUsers(json?.content);
        return setIsLoaded(true);
      } else return router.push("/profile");
    });
  }, [translations]);

  const handleStatusChange = async (userId, newStatus) => {
    const response = (async () => {
      switch (newStatus) {
        case "approve":
          return ServiceAdmin.approve(userId);
        case "ban":
          return ServiceAdmin.ban(userId);
        case "delete":
          return ServiceAdmin.delete(userId);
      }
    })();

    response.then((json) => {
      if (json.status === STATUS.SUCCESS) {
        toast.success(translations?.toast_messages[json?.code || 100]);
        setUsers(json?.content);
        return;
      }
    });
  };

  return (
    isLoaded && (
      <main className="container py-10">
        <h1 className="mb-8 text-3xl font-bold">{translations.admin_title}</h1>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translations.username}</TableHead>
                <TableHead>DDNET</TableHead>
                <TableHead>{translations.email}</TableHead>
                <TableHead>{translations.status}</TableHead>
                <TableHead>{translations.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user?.profile?.username}</TableCell>
                  <TableCell>{user?.profile?.ingamename || "-"}</TableCell>
                  <TableCell>
                    <SecretEmail email={user?.profile?.email} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "unverified"
                          ? "outline"
                          : user.role !== "unverified" && user.role !== "ban"
                            ? "success"
                            : "destructive"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.role === "unverified" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(user.id, "approve")}
                          variant="outline"
                          className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                        >
                          {translations.approve}
                        </Button>
                      )}

                      {user?.role != "ban" ? (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(user.id, "ban")}
                          variant="outline"
                          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                        >
                          {translations.ban}
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(user.id, "approve")
                            }
                            variant="outline"
                            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                          >
                            {translations.unban}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(user.id, "delete")
                            }
                            variant="outline"
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red500"
                          >
                            {translations.delete}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    )
  );
}
