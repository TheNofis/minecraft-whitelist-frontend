"use client";

import { useEffect, useState } from "react";
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

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    ServiceAdmin.users().then((json) => {
      if (json.status === STATUS.SUCCESS) return setUsers(json?.content);
      return router.push("/profile");
    });
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    ServiceAdmin.action(userId, newStatus).then((json) => {
      if (json.status === STATUS.SUCCESS) {
        toast.success(json.message);
        setUsers(json?.content);
        return;
      }
      return router.push("/profile");
    });
  };

  return (
    <main className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Админ панель</h1>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя пользователя</TableHead>
              <TableHead>DDNET</TableHead>
              <TableHead>Почта</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
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
                        Approve
                      </Button>
                    )}

                    {user?.role != "ban" ? (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(user.id, "ban")}
                        variant="outline"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                      >
                        ban
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(user.id, "approve")}
                        variant="outline"
                        className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                      >
                        UnBan
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
  );
}
