"use client";

import { MapPin, Star, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BusinessLocation } from "@/types/business";
import { LocationDialog } from "@/components/company/dashboard/business/forms/location-dialog";

interface LocationManagerProps {
  locations: BusinessLocation[];
}

export function LocationManager({ locations }: LocationManagerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Office Locations</CardTitle>
        <LocationDialog
          trigger={
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Add Location
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex items-start justify-between rounded-lg border p-4"
          >
            <div className="flex gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {location.city}, {location.country}
                  </p>
                  {location.isHeadquarters && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="mr-1 size-3" />
                      Headquarters
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {location.address}
                </p>
                {location.postalCode && (
                  <p className="text-xs text-muted-foreground">
                    {location.postalCode}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LocationDialog
                trigger={
                  <Button variant="ghost" size="icon" className="size-8">
                    <Pencil className="size-4" />
                  </Button>
                }
                location={location}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Location</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove{" "}
                      <span className="font-medium text-foreground">
                        {location.city}, {location.country}
                      </span>
                      ? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() =>
                        console.log("Location deleted:", location.id)
                      }
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
