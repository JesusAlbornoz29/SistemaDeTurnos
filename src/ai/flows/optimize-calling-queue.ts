'use server';

/**
 * @fileOverview An AI agent that optimizes the calling queue in a hospital.
 *
 * - optimizeCallingQueue - A function that handles the queue optimization process.
 * - OptimizeCallingQueueInput - The input type for the optimizeCallingQueue function.
 * - OptimizedCallingOrderOutput - The return type for the optimizeCallingQueue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCallingQueueInputSchema = z.object({
  queue: z
    .array(z.object({
      patientId: z.string(),
      arrivalTime: z.string().datetime(),
      serviceType: z.string(),
      estimatedWaitTime: z.number().optional(),
    }))
    .describe('The current calling queue with patient details.'),
  historicalWaitTimes: z
    .array(z.object({
      patientId: z.string(),
      serviceType: z.string(),
      waitTime: z.number(),
    }))
    .describe('Historical wait times for different service types.'),
});
export type OptimizeCallingQueueInput = z.infer<typeof OptimizeCallingQueueInputSchema>;

const OptimizedCallingOrderOutputSchema = z.object({
  optimizedQueue: z
    .array(z.string())
    .describe('The optimized calling queue with patient IDs in the new order.'),
  analysis: z.string().describe('Explanation of why the queue was reordered.'),
});
export type OptimizedCallingOrderOutput = z.infer<typeof OptimizedCallingOrderOutputSchema>;

export async function optimizeCallingQueue(input: OptimizeCallingQueueInput): Promise<OptimizedCallingOrderOutput> {
  return optimizeCallingQueueFlow(input);
}

const analyzeQueuePrompt = ai.definePrompt({
  name: 'analyzeQueuePrompt',
  input: {schema: OptimizeCallingQueueInputSchema},
  output: {schema: OptimizedCallingOrderOutputSchema},
  prompt: `You are an AI assistant helping to optimize the patient calling queue in a hospital to minimize overall wait times while maintaining fairness.  Analyze the current queue and historical wait times to determine the optimal calling order.

Current Queue:
{{#each queue}}
- Patient ID: {{patientId}}, Arrival Time: {{arrivalTime}}, Service Type: {{serviceType}}{{#if estimatedWaitTime}}, Estimated Wait Time: {{estimatedWaitTime}} minutes{{/if}}
{{/each}}

Historical Wait Times:
{{#each historicalWaitTimes}}
- Patient ID: {{patientId}}, Service Type: {{serviceType}}, Wait Time: {{waitTime}} minutes
{{/each}}

Consider these factors when reordering the queue:
*   Prioritize patients who have been waiting longer.
*   Consider the estimated wait times for each service type.
*   Ensure fairness by not excessively delaying any patient.
*   Optimize for overall minimum wait time across all patients.

Return the optimized queue with patient IDs in the new order, and provide a brief explanation of why the queue was reordered.

Output the optimized queue and analysis in JSON format.`,
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
