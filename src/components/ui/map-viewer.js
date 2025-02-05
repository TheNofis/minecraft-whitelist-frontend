"use client";

import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Map } from "lucide-react";
import { LanguageContext } from "@/context/LanguageContext";
import Link from "next/link";

export function MapViewer() {
  const { translations } = useContext(LanguageContext);

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base">{translations.livemap}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
          <iframe
            src="https://mineandtee.fun/maps/vanila"
            className="h-full w-full"
            allow="fullscreen"
          />
        </div>
        <Link
          className="text-sm text-muted-foreground mt-2 hover:underline"
          href="https://mineandtee.fun/maps/vanila"
        >
          {translations.opennewpage}
        </Link>
      </CardContent>
    </Card>
  );
}
