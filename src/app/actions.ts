'use server';

import { z } from 'zod';
import { optimizeCallingQueue } from '@/ai/flows/optimize-calling-queue';
import type { OptimizeCallingQueueInput, OptimizedCallingOrderOutput } from '@/ai/flows/optimize-calling-queue';
import { services } from '@/lib/data';

// This is a simulation of a database. In a real application, you would use
// a database like Firestore, PostgreSQL, etc.
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
      throw new Error('Invalid service selected.');
    }

    const today = getTodayString();
    if (!dailyCounters[today]) {
      dailyCounters[today] = {};
    }

    const service = services.find(s => s.id === validation.data.serviceId);
    if (!service) {
      throw new Error('Service not found.');
    }
    
    if (!dailyCounters[today][service.id]) {
      dailyCounters[today][service.id] = 0;
    }

    dailyCounters[today][service.id]++;
    
    const number = dailyCounters[today][service.id];
    const formattedNumber = `${service.prefix}-${String(number).padStart(3, '0')}`;

    // A small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, number: formattedNumber, serviceName: service.name };
  } catch(error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
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
    return { error: 'Failed to optimize queue. Please try again.' };
  }
}
