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
    name: 'Consulta General',
    description: 'Exámenes de salud de rutina y consultas.',
    icon: Stethoscope,
    prefix: 'G',
  },
  {
    id: 'cardiology',
    name: 'Cardiología',
    description: 'Atención especializada para afecciones del corazón.',
    icon: HeartPulse,
    prefix: 'C',
  },
  {
    id: 'pediatrics',
    name: 'Pediatría',
    description: 'Atención médica para bebés, niños y adolescentes.',
    icon: Baby,
    prefix: 'P',
  },
  {
    id: 'traumatology',
    name: 'Traumatología',
    description: 'Tratamiento de lesiones y heridas por accidentes.',
    icon: Bone,
    prefix: 'T',
  },
];

export type PatientStatus = 'En espera' | 'Llamando' | 'Atendido';

export type Patient = {
  patientId: string;
  arrivalTime: string;
  serviceType: string;
  status: PatientStatus;
  estimatedWaitTime?: number;
};

export const initialQueue: Patient[] = [
  { patientId: 'G-001', arrivalTime: new Date(Date.now() - 30 * 60000).toISOString(), serviceType: 'Consulta General', status: 'En espera' },
  { patientId: 'C-001', arrivalTime: new Date(Date.now() - 25 * 60000).toISOString(), serviceType: 'Cardiología', status: 'En espera' },
  { patientId: 'P-001', arrivalTime: new Date(Date.now() - 20 * 60000).toISOString(), serviceType: 'Pediatría', status: 'En espera' },
  { patientId: 'G-002', arrivalTime: new Date(Date.now() - 15 * 60000).toISOString(), serviceType: 'Consulta General', status: 'En espera' },
  { patientId: 'T-001', arrivalTime: new Date(Date.now() - 10 * 60000).toISOString(), serviceType: 'Traumatología', status: 'En espera' },
  { patientId: 'C-002', arrivalTime: new Date(Date.now() - 5 * 60000).toISOString(), serviceType: 'Cardiología', status: 'En espera' },
];

export type HistoricalWait = {
    patientId: string;
    serviceType: string;
    waitTime: number;
}

export const historicalWaitTimes: HistoricalWait[] = [
    { patientId: 'G-980', serviceType: 'Consulta General', waitTime: 25 },
    { patientId: 'C-981', serviceType: 'Cardiología', waitTime: 45 },
    { patientId: 'P-982', serviceType: 'Pediatría', waitTime: 15 },
    { patientId: 'T-983', serviceType: 'Traumatología', waitTime: 60 },
    { patientId: 'G-984', serviceType: 'Consulta General', waitTime: 30 },
    { patientId: 'C-985', serviceType: 'Cardiología', waitTime: 50 },
];
