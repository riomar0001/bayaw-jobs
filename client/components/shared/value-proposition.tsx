import { Card, CardContent } from "@/components/ui/card";

interface ValuePropositionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ValueProposition({
  icon,
  title,
  description,
}: ValuePropositionProps) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border hover:border-primary/50 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="p-8 text-center relative">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
          <div className="text-primary group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
