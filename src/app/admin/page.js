"use client";

import { useState } from "react";
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

const mockUsers = [
  {
    id: 1,
    username: "john_doe",
    gameUsername: "JohnGamer",
    email: "john@example.com",
    status: "pending",
  },
  {
    id: 2,
    username: "jane_smith",
    gameUsername: "JanePlayer",
    email: "jane@example.com",
    status: "pending",
  },
];

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleStatusChange = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );
  };

  return (
    <main className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Game Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.gameUsername || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "pending"
                        ? "outline"
                        : user.status === "approved"
                          ? "success"
                          : "destructive"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(user.id, "approved")}
                        variant="outline"
                        className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(user.id, "rejected")}
                        variant="outline"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(user.id, "ban")}
                        variant="outline"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                      >
                        Ban
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
