'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Patient } from '@/lib/data';
import { Archive } from 'lucide-react';

type HistoryTableProps = {
  attendedPatients: Patient[];
};

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

export function HistoryTable({ attendedPatients }: HistoryTableProps) {
  const getServiceVariant = (serviceType: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
      if (serviceType.includes('Cardiología')) return 'destructive';
      if (serviceType.includes('Pediatría')) return 'default';
      if (serviceType.includes('Traumatología')) return 'secondary';
      return 'outline';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Archive /> Historial de Pacientes Atendidos</CardTitle>
        <CardDescription>Pacientes que ya han sido atendidos hoy.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Número</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Hora de Llegada</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendedPatients.length > 0 ? (
                attendedPatients.map((patient) => (
                  <TableRow key={patient.patientId} className="bg-muted/50">
                    <TableCell className="font-medium">{patient.patientId}</TableCell>
                    <TableCell>
                       <Badge variant={getServiceVariant(patient.serviceType)}>{patient.serviceType}</Badge>
                    </TableCell>
                    <TableCell>{formatTime(patient.arrivalTime)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">Atendido</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Aún no hay pacientes atendidos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
