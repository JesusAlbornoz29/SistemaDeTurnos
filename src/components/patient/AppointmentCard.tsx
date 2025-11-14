'use client';

import { useState, useTransition } from 'react';
import { Ticket, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceSelector } from './ServiceSelector';
import { generateAppointmentNumber } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AppointmentCard() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<{ number: string; serviceName: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetNumber = () => {
    if (!selectedService) {
      toast({
        title: 'Selección Requerida',
        description: 'Por favor, selecciona un servicio para obtener un número de cita.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await generateAppointmentNumber(selectedService);
      if (result.success && result.number && result.serviceName) {
        setAppointment({ number: result.number, serviceName: result.serviceName });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudo generar un número de cita.',
          variant: 'destructive',
        });
      }
    });
  };

  const resetFlow = () => {
    setSelectedService(null);
    setAppointment(null);
  };

  if (appointment) {
    return (
      <Card className="w-full max-w-md text-center shadow-2xl animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <CardTitle className="text-2xl">Tu Número de Cita</CardTitle>
          <CardDescription>{appointment.serviceName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg p-8">
            <p className="text-5xl font-bold text-primary tracking-widest">{appointment.number}</p>
          </div>
          <p className="mt-4 text-muted-foreground">Por favor, espera a ser llamado. Ya puedes cerrar esta ventana.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetFlow}>Obtener Otro Número</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Solicitar una Cita</CardTitle>
        <CardDescription>Selecciona un servicio y obtén tu número de cita al instante.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">1. Selecciona un Servicio</h3>
          <ServiceSelector selectedService={selectedService} onSelectService={setSelectedService} />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button onClick={handleGetNumber} disabled={isPending || !selectedService} size="lg">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Ticket className="mr-2" />
          )}
          Obtener Mi Número
        </Button>
        <p className="text-xs text-center text-muted-foreground">
            Se generará un número secuencial único para ti. Este número se reinicia diariamente.
        </p>
      </CardFooter>
    </Card>
  );
}
