'use client';

import { useState, useTransition } from 'react';
import { Wand2, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { initialQueue, historicalWaitTimes, type Patient } from '@/lib/data';
import type { OptimizedCallingOrderOutput } from '@/ai/flows/optimize-calling-queue';
import { optimizeQueueAction } from '@/app/actions';
import { Badge } from '@/components/ui/badge';

function formatTime(isoString: string) {
    let date;
    try {
        date = new Date(isoString);
        if (isNaN(date.getTime())) {
            // Handle invalid date string
            return 'Invalid Date';
        }
    } catch (e) {
        return 'Invalid Date';
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function QueueTable() {
  const [queue, setQueue] = useState<Patient[]>(initialQueue);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedCallingOrderOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleOptimizeQueue = () => {
    startTransition(async () => {
      setOptimizedResult(null);
      const result = await optimizeQueueAction({ queue, historicalWaitTimes });

      if (result.data) {
        const newQueue = result.data.optimizedQueue.map(patientId => {
          const patient = queue.find(p => p.patientId === patientId);
          if (!patient) throw new Error('Patient not found in original queue');
          return patient;
        });

        const remainingPatients = queue.filter(p => !result.data!.optimizedQueue.includes(p.patientId));
        
        setQueue([...newQueue, ...remainingPatients]);
        setOptimizedResult(result.data);
        toast({
          title: 'Queue Optimized',
          description: 'The patient queue has been successfully reordered by AI.',
        });
      } else {
        toast({
          title: 'Optimization Failed',
          description: result.error || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    });
  };

  const getServiceVariant = (serviceType: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
      if (serviceType.includes('Cardiology')) return 'destructive';
      if (serviceType.includes('Pediatrics')) return 'default';
      if (serviceType.includes('Trauma')) return 'secondary';
      return 'outline';
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Patient Calling Queue</CardTitle>
            <CardDescription>Current list of patients waiting for their appointments.</CardDescription>
          </div>
          <Button onClick={handleOptimizeQueue} disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            Optimize with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {optimizedResult && (
          <Alert className="bg-accent/10 border-accent/20 text-accent-foreground">
            <Info className="h-4 w-4 text-accent" />
            <AlertTitle className="font-semibold">AI Analysis</AlertTitle>
            <AlertDescription>
              {optimizedResult.analysis}
            </AlertDescription>
          </Alert>
        )}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Number</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((patient, index) => (
                <TableRow key={patient.patientId} className={index === 0 ? 'bg-primary/10' : ''}>
                  <TableCell className="font-medium">{patient.patientId}</TableCell>
                  <TableCell>
                    <Badge variant={getServiceVariant(patient.serviceType)}>{patient.serviceType}</Badge>
                  </TableCell>
                  <TableCell>{formatTime(patient.arrivalTime)}</TableCell>
                  <TableCell className="text-right">
                    {index === 0 ? (
                        <Badge variant="default">Next</Badge>
                    ) : (
                        <Badge variant="outline">Waiting</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
