'use server';

import { z } from 'zod';
import { optimizeCallingQueue } from '@/ai/flows/optimize-calling-queue';
import type { OptimizeCallingQueueInput, OptimizedCallingOrderOutput } from '@/ai/flows/optimize-calling-queue';
import { services } from '@/lib/data';

// Esto es una simulación de una base de datos. En una aplicación real, usarías
// una base de datos como Firestore, PostgreSQL, etc.
const dailyCounters: Record<string, Record<string, number>> = {};

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

const generateNumberSchema = z.object({
  serviceId: z.enum(['general', 'cardiology', 'pediatrics', 'traumatology']),
});

export async function generateAppointmentNumber(serviceId: string) {
  try {
    const validation = generateNumberSchema.safeParse({ serviceId });
    if (!validation.success) {
      throw new Error('Servicio seleccionado no válido.');
    }

    const today = getTodayString();
    if (!dailyCounters[today]) {
      dailyCounters[today] = {};
    }

    const service = services.find(s => s.id === validation.data.serviceId);
    if (!service) {
      throw new Error('Servicio no encontrado.');
    }
    
    if (!dailyCounters[today][service.id]) {
      dailyCounters[today][service.id] = 0;
    }

    dailyCounters[today][service.id]++;
    
    const number = dailyCounters[today][service.id];
    const formattedNumber = `${service.prefix}-${String(number).padStart(3, '0')}`;

    // Un pequeño retraso para simular la latencia de la red
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, number: formattedNumber, serviceName: service.name };
  } catch(error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
    return { success: false, error: message };
  }
}


export async function optimizeQueueAction(
  input: OptimizeCallingQueueInput
): Promise<{ data?: OptimizedCallingOrderOutput; error?: string }> {
  try {
    const result = await optimizeCallingQueue(input);
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'No se pudo optimizar la cola. Por favor, inténtalo de nuevo.' };
  }
}
