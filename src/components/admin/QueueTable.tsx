'use client';

import { useState, useTransition, useMemo } from 'react';
import { Wand2, Loader2, Info, UserCheck, UserPlus, Hourglass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { Patient, HistoricalWait } from '@/lib/data';
import type { OptimizedCallingOrderOutput } from '@/ai/flows/optimize-calling-queue';
import { optimizeQueueAction } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

function formatTime(isoString: string) {
    let date;
    try {
        date = new Date(isoString);
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
    } catch (e) {
        return 'Fecha inválida';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type QueueTableProps = {
  callingPatient: Patient | undefined;
  waitingPatients: Patient[];
  historicalWaitTimes: HistoricalWait[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  updatePatientStatus: (patientId: string, status: Patient['status']) => void;
};

export function QueueTable({
  callingPatient,
  waitingPatients,
  historicalWaitTimes,
  setPatients,
  updatePatientStatus,
}: QueueTableProps) {
  const [optimizedResult, setOptimizedResult] = useState<OptimizedCallingOrderOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleOptimizeQueue = () => {
    startTransition(async () => {
      setOptimizedResult(null);
      const queueInput = (callingPatient ? [callingPatient] : []).concat(waitingPatients);
      const result = await optimizeQueueAction({ queue: queueInput, historicalWaitTimes });

      if (result.data) {
        setPatients(prevPatients => {
          const newOrderedIds = result.data.optimizedQueue;
          const currentPatients = prevPatients.filter(p => p.status !== 'Atendido');
          
          const newQueue = newOrderedIds.map(id => currentPatients.find(p => p.patientId === id)!);
          const unranked = currentPatients.filter(p => !newOrderedIds.includes(p.patientId));

          return [...newQueue, ...unranked, ...prevPatients.filter(p => p.status === 'Atendido')];
        });

        setOptimizedResult(result.data);
        toast({
          title: 'Cola Optimizada',
          description: 'La cola de pacientes ha sido reordenada por IA.',
        });
      } else {
        toast({
          title: 'Falló la Optimización',
          description: result.error || 'Ocurrió un error inesperado.',
          variant: 'destructive',
        });
      }
    });
  };

  const getServiceVariant = (serviceType: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
      if (serviceType.includes('Cardiología')) return 'destructive';
      if (serviceType.includes('Pediatría')) return 'default';
      if (serviceType.includes('Traumatología')) return 'secondary';
      return 'outline';
  };

  const visibleWaitingPatients = useMemo(() => waitingPatients.slice(0, 10), [waitingPatients]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Cola de Pacientes</CardTitle>
            <CardDescription>Lista actual de pacientes esperando sus citas.</CardDescription>
          </div>
          <Button onClick={handleOptimizeQueue} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
            Optimizar con IA
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {optimizedResult && (
          <Alert className="bg-accent/10 border-accent/20 text-accent-foreground">
            <Info className="h-4 w-4 text-accent" />
            <AlertTitle className="font-semibold">Análisis de IA</AlertTitle>
            <AlertDescription>{optimizedResult.analysis}</AlertDescription>
          </Alert>
        )}
        
        {callingPatient && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><UserCheck className="text-primary"/>Llamando Ahora</h3>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Número</TableHead>
                            <TableHead>Servicio</TableHead>
                            <TableHead>Hora de Llegada</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="bg-primary/10">
                            <TableCell className="font-medium">{callingPatient.patientId}</TableCell>
                            <TableCell>
                                <Badge variant={getServiceVariant(callingPatient.serviceType)}>{callingPatient.serviceType}</Badge>
                            </TableCell>
                            <TableCell>{formatTime(callingPatient.arrivalTime)}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => updatePatientStatus(callingPatient.patientId, 'Atendido')}>
                                    Marcar como Atendido
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
          </div>
        )}

        <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Hourglass className="text-amber-600"/>En Espera</h3>
            <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Número</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Hora de Llegada</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {visibleWaitingPatients.length > 0 ? visibleWaitingPatients.map((patient) => (
                    <TableRow key={patient.patientId}>
                    <TableCell className="font-medium">{patient.patientId}</TableCell>
                    <TableCell>
                        <Badge variant={getServiceVariant(patient.serviceType)}>{patient.serviceType}</Badge>
                    </TableCell>
                    <TableCell>{formatTime(patient.arrivalTime)}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updatePatientStatus(patient.patientId, 'Llamando')} disabled={!!callingPatient}>
                                    Llamar Siguiente
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updatePatientStatus(patient.patientId, 'Atendido')}>
                                    Marcar como Atendido
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No hay pacientes en espera.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
             {waitingPatients.length > 10 && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                y {waitingPatients.length - 10} más en espera...
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
