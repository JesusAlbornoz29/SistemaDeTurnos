'use client';

import type { Service } from '@/lib/data';
import { services } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ServiceSelectorProps = {
  selectedService: string | null;
  onSelectService: (serviceId: string) => void;
};

export function ServiceSelector({ selectedService, onSelectService }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((service: Service) => (
        <Card
          key={service.id}
          onClick={() => onSelectService(service.id)}
          className={cn(
            'cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
            selectedService === service.id
              ? 'ring-2 ring-primary shadow-lg bg-primary/10'
              : 'ring-0'
          )}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
                <service.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{service.name}</CardTitle>
              <CardDescription className="text-sm">{service.description}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
