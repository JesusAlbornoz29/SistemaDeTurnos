'use client';

import { useState, useMemo } from 'react';
import { initialQueue, historicalWaitTimes, type Patient } from '@/lib/data';
import { QueueTable } from './QueueTable';
import { HistoryTable } from './HistoryTable';

export function QueueManager() {
  const [patients, setPatients] = useState<Patient[]>(initialQueue);

  const updatePatientStatus = (patientId: string, newStatus: Patient['status']) => {
    setPatients(prevPatients =>
      prevPatients.map(p => (p.patientId === patientId ? { ...p, status: newStatus } : p))
    );
  };
  
  const waitingPatients = useMemo(() => patients.filter(p => p.status === 'En espera'), [patients]);
  const callingPatient = useMemo(() => patients.find(p => p.status === 'Llamando'), [patients]);
  const attendedPatients = useMemo(() => patients.filter(p => p.status === 'Atendido'), [patients]);

  return (
    <div className="space-y-8">
      <QueueTable
        callingPatient={callingPatient}
        waitingPatients={waitingPatients}
        historicalWaitTimes={historicalWaitTimes}
        setPatients={setPatients}
        updatePatientStatus={updatePatientStatus}
      />
      <HistoryTable attendedPatients={attendedPatients} />
    </div>
  );
}
