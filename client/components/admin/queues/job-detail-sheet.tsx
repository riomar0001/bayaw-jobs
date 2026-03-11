'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface JobRow {
  id: string;
  name: string;
  state: string;
  data: unknown;
  opts: unknown;
  attemptsMade: number;
  maxAttempts: number;
  failedReason: string | null;
  stacktrace: string[];
  processedOn: number | null;
  finishedOn: number | null;
  timestamp: number;
  delay: number;
}

const stateColor: Record<string, string> = {
  waiting: 'bg-blue-100 text-blue-800',
  active: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  delayed: 'bg-purple-100 text-purple-800',
  paused: 'bg-gray-100 text-gray-700',
};

function formatTs(ts: number | null) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0 w-28">{label}</span>
      <span className="text-sm font-medium text-right break-all">{value}</span>
    </div>
  );
}

interface SectionProps {
  title: string;
  titleClass?: string;
  children: React.ReactNode;
}

function Section({ title, titleClass, children }: SectionProps) {
  return (
    <div className="space-y-2 px-4">
      <p className={cn('text-xs font-semibold uppercase tracking-wider text-muted-foreground', titleClass)}>
        {title}
      </p>
      {children}
    </div>
  );
}

interface JobDetailSheetProps {
  job: JobRow | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetailSheet({ job, open, onClose }: JobDetailSheetProps) {
  if (!job) return null;

  const attemptsExhausted = job.attemptsMade >= job.maxAttempts;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-4 pt-4 pb-3 border-b">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base">Job Details</SheetTitle>
            <Badge variant="secondary" className={cn('text-xs', stateColor[job.state])}>
              {job.state}
            </Badge>
            {attemptsExhausted && job.state === 'failed' && (
              <Badge variant="secondary" className="text-xs bg-red-600 text-white">
                DLQ
              </Badge>
            )}
          </div>
          <SheetDescription className="font-mono text-xs break-all leading-relaxed">
            {job.id}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="py-4 space-y-0">

            {/* Info section */}
            <Section title="Info">
              <div className="rounded-md border divide-y bg-muted/30">
                <div className="px-3">
                  <InfoRow label="Job Name" value={job.name} />
                </div>
                <div className="px-3">
                  <InfoRow
                    label="Attempts"
                    value={
                      <span className={cn(attemptsExhausted ? 'text-destructive' : '')}>
                        {job.attemptsMade} / {job.maxAttempts}
                      </span>
                    }
                  />
                </div>
                <div className="px-3">
                  <InfoRow label="Delay" value={job.delay ? `${job.delay}ms` : '—'} />
                </div>
                <div className="px-3">
                  <InfoRow label="Created" value={formatTs(job.timestamp)} />
                </div>
                <div className="px-3">
                  <InfoRow label="Processed" value={formatTs(job.processedOn)} />
                </div>
                <div className="px-3">
                  <InfoRow label="Finished" value={formatTs(job.finishedOn)} />
                </div>
              </div>
            </Section>

            {/* Failed reason */}
            {job.failedReason && (
              <>
                <Separator className="my-4" />
                <Section title="Failed Reason" titleClass="text-destructive">
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm text-destructive leading-relaxed">{job.failedReason}</p>
                  </div>
                </Section>
              </>
            )}

            {/* Stacktrace */}
            {job.stacktrace?.length > 0 && (
              <>
                <Separator className="my-4" />
                <Section title="Stacktrace">
                  <pre className="rounded-md border bg-muted p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all text-destructive leading-relaxed">
                    {job.stacktrace.join('\n')}
                  </pre>
                </Section>
              </>
            )}

            {/* Payload */}
            <Separator className="my-4" />
            <Section title="Payload">
              <pre className="rounded-md border bg-muted p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify(job.data, null, 2)}
              </pre>
            </Section>

            {/* Options */}
            <Separator className="my-4" />
            <Section title="Options">
              <pre className="rounded-md border bg-muted p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify(job.opts, null, 2)}
              </pre>
            </Section>

            {/* bottom breathing room */}
            <div className="h-4" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
