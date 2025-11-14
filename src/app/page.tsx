import { Header } from '@/components/common/Header';
import { AppointmentCard } from '@/components/patient/AppointmentCard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <AppointmentCard />
      </main>
      <footer className="py-4">
        <p className="text-center text-sm text-muted-foreground">
          CitaPresto &copy; 2024
        </p>
      </footer>
    </div>
  );
}
