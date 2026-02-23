import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target } from "lucide-react";

interface CareerStatusCardProps {
  status: "actively-looking" | "employed" | "open-to-opportunities";
}

export function CareerStatusCard({ status }: CareerStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Career Status</h2>
        </div>
      </CardHeader>

      <CardContent>
        <Select defaultValue={status}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="actively-looking">
              Actively Seeking Job
            </SelectItem>
            <SelectItem value="employed">Employed</SelectItem>
            <SelectItem value="open-to-opportunities">
              Open to Opportunities
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
