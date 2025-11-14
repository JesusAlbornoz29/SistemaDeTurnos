import type { LucideIcon } from 'lucide-react';
import { Stethoscope, HeartPulse, Baby, Bone } from 'lucide-react';

export type Service = {
  id: 'general' | 'cardiology' | 'pediatrics' | 'traumatology';
  name: string;
  description: string;
  icon: LucideIcon;
  prefix: 'G' | 'C' | 'P' | 'T';
};

export const services: Service[] = [
  {
    id: 'general',
    name: 'General Check-up',
    description: 'Routine health examinations and consultations.',
    icon: Stethoscope,
    prefix: 'G',
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Specialized care for heart and blood vessel conditions.',
    icon: HeartPulse,
    prefix: 'C',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Medical care for infants, children, and adolescents.',
    icon: Baby,
    prefix: 'P',
  },
  {
    id: 'traumatology',
    name: 'Traumatology',
    description: 'Dealing with injuries and wounds caused by accidents.',
    icon: Bone,
    prefix: 'T',
  },
];

export type Patient = {
  patientId: string;
  arrivalTime: string;
  serviceType: string;
  estimatedWaitTime?: number;
};

export const initialQueue: Patient[] = [
  { patientId: 'G-001', arrivalTime: new Date(Date.now() - 30 * 60000).toISOString(), serviceType: 'General Check-up' },
  { patientId: 'C-001', arrivalTime: new Date(Date.now() - 25 * 60000).toISOString(), serviceType: 'Cardiology' },
  { patientId: 'P-001', arrivalTime: new Date(Date.now() - 20 * 60000).toISOString(), serviceType: 'Pediatrics' },
  { patientId: 'G-002', arrivalTime: new Date(Date.now() - 15 * 60000).toISOString(), serviceType: 'General Check-up' },
  { patientId: 'T-001', arrivalTime: new Date(Date.now() - 10 * 60000).toISOString(), serviceType: 'Traumatology' },
  { patientId: 'C-002', arrivalTime: new Date(Date.now() - 5 * 60000).toISOString(), serviceType: 'Cardiology' },
];

export type HistoricalWait = {
    patientId: string;
    serviceType: string;
    waitTime: number;
}

export const historicalWaitTimes: HistoricalWait[] = [
    { patientId: 'G-980', serviceType: 'General Check-up', waitTime: 25 },
    { patientId: 'C-981', serviceType: 'Cardiology', waitTime: 45 },
    { patientId: 'P-982', serviceType: 'Pediatrics', waitTime: 15 },
    { patientId: 'T-983', serviceType: 'Traumatology', waitTime: 60 },
    { patientId: 'G-984', serviceType: 'General Check-up', waitTime: 30 },
    { patientId: 'C-985', serviceType: 'Cardiology', waitTime: 50 },
];
