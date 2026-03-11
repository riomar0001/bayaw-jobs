'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  Timer,
  PauseCircle,
  RefreshCw,
  RotateCcw,
  Trash2,
  Play,
  Pause,
  Droplets,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/company/dashboard/layout/page-header';
import { ErrorAlert } from '@/components/common/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/alert-dialog';
import { QueueStatCard } from '@/components/admin/queues/queue-stat-card';
import { JobsTable } from '@/components/admin/queues/jobs-table';
import { JobRow } from '@/components/admin/queues/job-detail-sheet';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';

interface QueueSummary {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  isPaused: boolean;
}

interface JobsData {
  jobs: JobRow[];
  total: number;
}

type JobState = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';

const STATE_TABS: { value: JobState; label: string }[] = [
  { value: 'waiting', label: 'Waiting' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'delayed', label: 'Delayed' },
];

function QueueCard({
  queue,
  onRefresh,
}: {
  queue: QueueSummary;
  onRefresh: () => void;
}) {
  const [activeTab, setActiveTab] = useState<JobState>('waiting');
  const [dlqTab, setDlqTab] = useState<'jobs' | 'dlq'>('jobs');
  const [jobsData, setJobsData] = useState<JobsData | null>(null);
  const [dlqData, setDlqData] = useState<JobsData | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchJobs = useCallback(
    async (state: JobState) => {
      setLoadingJobs(true);
      try {
        const res = await apiClient.get<{ success: boolean; data: JobsData }>(
          `/admin/queues/${queue.name}/jobs?state=${state}`,
        );
        setJobsData(res.data.data);
      } catch {
        toast.error('Failed to load jobs');
      } finally {
        setLoadingJobs(false);
      }
    },
    [queue.name],
  );

  const fetchDlq = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: JobsData }>(
        `/admin/queues/${queue.name}/dlq`,
      );
      setDlqData(res.data.data);
    } catch {
      toast.error('Failed to load DLQ jobs');
    } finally {
      setLoadingJobs(false);
    }
  }, [queue.name]);

  useEffect(() => {
    if (dlqTab === 'jobs') {
      void fetchJobs(activeTab);
    } else {
      void fetchDlq();
    }
  }, [activeTab, dlqTab, fetchJobs, fetchDlq]);

  const handleAction = async (action: () => Promise<void>, successMsg: string) => {
    setActionLoading(true);
    try {
      await action();
      toast.success(successMsg);
      onRefresh();
      if (dlqTab === 'jobs') void fetchJobs(activeTab);
      else void fetchDlq();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const retryJob = (jobId: string) =>
    handleAction(
      () => apiClient.post(`/admin/queues/${queue.name}/jobs/${jobId}/retry`).then(() => {}),
      'Job queued for retry',
    );

  const removeJob = (jobId: string) =>
    handleAction(
      () => apiClient.delete(`/admin/queues/${queue.name}/jobs/${jobId}`).then(() => {}),
      'Job removed',
    );

  const retryAllDlq = () =>
    handleAction(
      () => apiClient.post(`/admin/queues/${queue.name}/dlq/retry-all`).then(() => {}),
      'All DLQ jobs queued for retry',
    );

  const clearDlq = () =>
    handleAction(
      () => apiClient.delete(`/admin/queues/${queue.name}/dlq/clear`).then(() => {}),
      'DLQ cleared',
    );

  const togglePause = () =>
    handleAction(
      () =>
        queue.isPaused
          ? apiClient.post(`/admin/queues/${queue.name}/resume`).then(() => {})
          : apiClient.post(`/admin/queues/${queue.name}/pause`).then(() => {}),
      queue.isPaused ? 'Queue resumed' : 'Queue paused',
    );

  const drain = () =>
    handleAction(
      () => apiClient.post(`/admin/queues/${queue.name}/drain`).then(() => {}),
      'Queue drained',
    );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base capitalize">{queue.name}</CardTitle>
            <Badge
              variant="secondary"
              className={queue.isPaused ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
            >
              {queue.isPaused ? 'Paused' : 'Running'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePause}
              disabled={actionLoading}
            >
              {queue.isPaused ? (
                <><Play className="size-3.5 mr-1" />Resume</>
              ) : (
                <><Pause className="size-3.5 mr-1" />Pause</>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={actionLoading}>
                  <Droplets className="size-3.5 mr-1" />Drain
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Drain queue?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes all waiting and delayed jobs from <strong>{queue.name}</strong>.
                    Active jobs will complete normally. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={drain}>Drain</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
          <QueueStatCard label="Waiting" value={queue.waiting} icon={Clock} color="blue" />
          <QueueStatCard label="Active" value={queue.active} icon={Zap} color="yellow" />
          <QueueStatCard label="Completed" value={queue.completed} icon={CheckCircle2} color="green" />
          <QueueStatCard label="Failed" value={queue.failed} icon={XCircle} color="red" />
          <QueueStatCard label="Delayed" value={queue.delayed} icon={Timer} color="purple" />
          <QueueStatCard label="Paused" value={queue.paused} icon={PauseCircle} color="gray" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Jobs tabs vs DLQ toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={dlqTab === 'jobs' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDlqTab('jobs')}
          >
            Jobs Browser
          </Button>
          <Button
            variant={dlqTab === 'dlq' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setDlqTab('dlq')}
            className="gap-1.5"
          >
            <AlertTriangle className="size-3.5" />
            Dead Letter Queue
            {queue.failed > 0 && (
              <Badge className="ml-1 bg-red-600 text-white text-xs px-1.5 py-0 h-4">
                {queue.failed}
              </Badge>
            )}
          </Button>
        </div>

        {/* Jobs Browser */}
        {dlqTab === 'jobs' && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as JobState)}>
            <div className="flex items-center justify-between mb-3">
              <TabsList>
                {STATE_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} className="text-xs">
                    {t.label}
                    {queue[t.value] > 0 && (
                      <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0 h-4">
                        {queue[t.value]}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button variant="ghost" size="sm" onClick={() => fetchJobs(activeTab)} disabled={loadingJobs}>
                <RefreshCw className={`size-3.5 ${loadingJobs ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {STATE_TABS.map((t) => (
              <TabsContent key={t.value} value={t.value}>
                {loadingJobs ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <JobsTable
                    jobs={jobsData?.jobs ?? []}
                    showRetry={t.value === 'failed'}
                    onRetry={retryJob}
                    onRemove={removeJob}
                    emptyMessage={`No ${t.label.toLowerCase()} jobs.`}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Dead Letter Queue */}
        {dlqTab === 'dlq' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dead Letter Queue</p>
                <p className="text-xs text-muted-foreground">
                  Jobs that exhausted all retry attempts ({dlqData?.total ?? 0} jobs)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={fetchDlq} disabled={loadingJobs}>
                  <RefreshCw className={`size-3.5 ${loadingJobs ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryAllDlq}
                  disabled={actionLoading || (dlqData?.total ?? 0) === 0}
                >
                  <RotateCcw className="size-3.5 mr-1" />
                  Retry All
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={actionLoading || (dlqData?.total ?? 0) === 0}
                    >
                      <Trash2 className="size-3.5 mr-1" />
                      Clear DLQ
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear dead letter queue?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes all {dlqData?.total ?? 0} failed jobs from the{' '}
                        <strong>{queue.name}</strong> queue. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={clearDlq}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Clear DLQ
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {loadingJobs ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <JobsTable
                jobs={dlqData?.jobs ?? []}
                showRetry
                onRetry={retryJob}
                onRemove={removeJob}
                emptyMessage="No dead letter jobs. All retries are within limit."
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminQueuesPage() {
  const [queues, setQueues] = useState<QueueSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueues = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get<{ success: boolean; data: QueueSummary[] }>('/admin/queues');
      setQueues(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queues');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchQueues();
  }, []);

  const totalFailed = queues.reduce((acc, q) => acc + q.failed, 0);
  const totalActive = queues.reduce((acc, q) => acc + q.active, 0);
  const totalWaiting = queues.reduce((acc, q) => acc + q.waiting, 0);

  return (
    <>
      <PageHeader
        title="Queue Management"
        description="Monitor and manage background job queues and dead letter queues"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Queues' }]}
        actions={
          <Button variant="outline" size="sm" onClick={fetchQueues} disabled={isLoading}>
            <RefreshCw className={`size-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {error && <ErrorAlert message={error} onRetry={fetchQueues} />}

        {/* Platform-wide summary */}
        {!isLoading && queues.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <QueueStatCard label="Active Jobs" value={totalActive} icon={Zap} color="yellow" />
            <QueueStatCard label="Waiting Jobs" value={totalWaiting} icon={Clock} color="blue" />
            <QueueStatCard
              label="Failed (DLQ)"
              value={totalFailed}
              icon={XCircle}
              color={totalFailed > 0 ? 'red' : 'gray'}
            />
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {!isLoading && !error && queues.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No queues registered.</p>
          </div>
        )}

        {/* Per-queue cards */}
        {!isLoading &&
          queues.map((queue) => (
            <QueueCard key={queue.name} queue={queue} onRefresh={fetchQueues} />
          ))}
      </div>
    </>
  );
}
