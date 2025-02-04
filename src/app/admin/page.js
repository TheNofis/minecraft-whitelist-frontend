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

export default function AdminPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    ServiceAdmin.users().then((json) => {
      if (json.status === STATUS.SUCCESS) return setUsers(json?.content);
      else return router.push("/profile");
    });
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    ServiceAdmin.action(userId, newStatus).then((json) => {
      if (json.status === STATUS.SUCCESS) {
        toast.success(json.message);
        setUsers(json?.content);
        return;
      }
    });
  };

  return (
    isLoaded && (
      <main className="container py-10">
        <h1 className="mb-8 text-3xl font-bold">Админ панель</h1>
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
                  <TableCell>{user?.profile?.email}</TableCell>
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
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(user.id, "approve")}
                          variant="outline"
                          className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                        >
                          {translations.unban}
                        </Button>
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
