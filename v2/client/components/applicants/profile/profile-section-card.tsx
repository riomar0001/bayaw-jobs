"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface ProfileSectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  onEdit?: () => void;
  hideEdit?: boolean;
}

export function ProfileSectionCard({
  title,
  children,
  onEdit,
  hideEdit,
}: ProfileSectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {!hideEdit && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
