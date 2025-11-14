'use server';

/**
 * @fileOverview Un agente de IA que optimiza la cola de llamadas en un hospital.
 *
 * - optimizeCallingQueue - Una función que maneja el proceso de optimización de la cola.
 * - OptimizeCallingQueueInput - El tipo de entrada para la función optimizeCallingQueue.
 * - OptimizedCallingOrderOutput - El tipo de retorno para la función optimizeCallingQueue.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCallingQueueInputSchema = z.object({
  queue: z
    .array(z.object({
      patientId: z.string(),
      arrivalTime: z.string().datetime(),
      serviceType: z.string(),
      status: z.string(),
      estimatedWaitTime: z.number().optional(),
    }))
    .describe('La cola de llamadas actual con detalles del paciente.'),
  historicalWaitTimes: z
    .array(z.object({
      patientId: z.string(),
      serviceType: z.string(),
      waitTime: z.number(),
    }))
    .describe('Tiempos de espera históricos para diferentes tipos de servicio.'),
});
export type OptimizeCallingQueueInput = z.infer<typeof OptimizeCallingQueueInputSchema>;

const OptimizedCallingOrderOutputSchema = z.object({
  optimizedQueue: z
    .array(z.string())
    .describe('La cola de llamadas optimizada con los IDs de los pacientes en el nuevo orden.'),
  analysis: z.string().describe('Explicación de por qué se reordenó la cola.'),
});
export type OptimizedCallingOrderOutput = z.infer<typeof OptimizedCallingOrderOutputSchema>;

export async function optimizeCallingQueue(input: OptimizeCallingQueueInput): Promise<OptimizedCallingOrderOutput> {
  return optimizeCallingQueueFlow(input);
}

const analyzeQueuePrompt = ai.definePrompt({
  name: 'analyzeQueuePrompt',
  input: {schema: OptimizeCallingQueueInputSchema},
  output: {schema: OptimizedCallingOrderOutputSchema},
  prompt: `Eres un asistente de IA que ayuda a optimizar la cola de llamadas de pacientes en un hospital para minimizar los tiempos de espera generales manteniendo la equidad. Analiza la cola actual y los tiempos de espera históricos para determinar el orden de llamada óptimo.

Cola Actual:
{{#each queue}}
- ID Paciente: {{patientId}}, Hora de Llegada: {{arrivalTime}}, Tipo de Servicio: {{serviceType}}, Estado: {{status}}{{#if estimatedWaitTime}}, Tiempo de Espera Estimado: {{estimatedWaitTime}} minutos{{/if}}
{{/each}}

Tiempos de Espera Históricos:
{{#each historicalWaitTimes}}
- ID Paciente: {{patientId}}, Tipo de Servicio: {{serviceType}}, Tiempo de Espera: {{waitTime}} minutos
{{/each}}

Considera estos factores al reordenar la cola:
*   Prioriza a los pacientes que han estado esperando más tiempo.
*   Considera los tiempos de espera estimados para cada tipo de servicio.
*   Asegura la equidad no retrasando excesivamente a ningún paciente.
*   Optimiza para el tiempo de espera mínimo general en todos los pacientes.
*   Solo reordena a los pacientes que están 'En espera'. No incluyas pacientes 'Llamando' o 'Atendido' en la cola optimizada.

Devuelve la cola optimizada con los IDs de los pacientes en el nuevo orden, y proporciona una breve explicación de por qué se reordenó la cola.

Genera la cola optimizada y el análisis en formato JSON.`,
});

const optimizeCallingQueueFlow = ai.defineFlow(
  {
    name: 'optimizeCallingQueueFlow',
    inputSchema: OptimizeCallingQueueInputSchema,
    outputSchema: OptimizedCallingOrderOutputSchema,
  },
  async input => {
    const {output} = await analyzeQueuePrompt(input);
    return output!;
  }
);
