/**
 * FLOW DIAGRAM COMPONENT
 * ======================
 * 
 * Visualizza il flusso dall'evento alla notifica.
 * 
 * CONCETTO CHIAVE - ARCHITETTURA EVENT-DRIVEN:
 * 
 * ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
 * │   EVENT     │ ──▶ │    EVENT    │ ──▶ │  HANDLER/   │ ──▶ │ NOTIFICATION│
 * │  PRODUCER   │     │    QUEUE    │     │  PROCESSOR  │     │   STORE     │
 * └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
 *     (Click)          (Buffer)           (Async Logic)        (UI Update)
 * 
 * Questo pattern permette di costruire sistemi:
 * - Scalabili (ogni componente può scalare indipendentemente)
 * - Resilienti (se un componente fallisce, gli eventi non si perdono)
 * - Flessibili (facile aggiungere nuovi handler)
 */

import { Zap, Database, Cpu, Bell, ArrowRight } from 'lucide-react';

interface FlowDiagramProps {
  isProcessing: boolean;
  hasEvents: boolean;
}

export const FlowDiagram = ({ isProcessing, hasEvents }: FlowDiagramProps) => {
  const steps = [
    {
      id: 'producer',
      icon: <Zap className="w-6 h-6" />,
      label: 'Event Producer',
      sublabel: 'Genera evento',
      description: 'Azione utente → Evento',
      active: hasEvents,
    },
    {
      id: 'queue',
      icon: <Database className="w-6 h-6" />,
      label: 'Event Queue',
      sublabel: 'Buffer eventi',
      description: 'FIFO, asincrono',
      active: isProcessing,
    },
    {
      id: 'handler',
      icon: <Cpu className="w-6 h-6" />,
      label: 'Event Handler',
      sublabel: 'Elabora evento',
      description: 'Business logic',
      active: isProcessing,
    },
    {
      id: 'notification',
      icon: <Bell className="w-6 h-6" />,
      label: 'Notification',
      sublabel: 'Notifica utente',
      description: 'UI Update',
      active: false,
    },
  ];

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="text-2xl">🔄</span>
          Flusso Event-Driven
        </h2>
        <p className="text-sm text-muted-foreground">
          Visualizzazione del percorso dall'azione alla notifica.
          Ogni step è <span className="text-accent font-medium">asincrono</span> e <span className="text-primary font-medium">non bloccante</span>.
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="flex items-center justify-between gap-2 py-6 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Box */}
            <div 
              className={`
                relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-500
                min-w-[100px]
                ${step.active 
                  ? 'border-primary bg-primary/10 shadow-lg glow-primary scale-105' 
                  : 'border-border bg-card hover:border-muted-foreground/50'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                p-3 rounded-lg mb-2 transition-colors duration-300
                ${step.active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}
              `}>
                {step.icon}
              </div>
              
              {/* Labels */}
              <p className="text-sm font-semibold text-center whitespace-nowrap">
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {step.sublabel}
              </p>

              {/* Processing indicator */}
              {step.active && (
                <div className="absolute -top-2 -right-2">
                  <span className="flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                  </span>
                </div>
              )}
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <div className="mx-2 flex items-center">
                <div className={`
                  relative h-0.5 w-8 overflow-hidden
                  ${step.active ? 'bg-primary/30' : 'bg-border'}
                `}>
                  {step.active && (
                    <div className="flow-line absolute inset-0 h-full w-8" />
                  )}
                </div>
                <ArrowRight className={`
                  w-4 h-4 -ml-1 transition-colors duration-300
                  ${step.active ? 'text-primary' : 'text-muted-foreground'}
                `} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison: Sync vs Async */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 rounded-lg bg-event-error/5 border border-event-error/20">
          <h4 className="text-sm font-semibold text-event-error mb-2">
            ❌ Codice Sincrono (bloccante)
          </h4>
          <pre className="text-xs text-muted-foreground font-mono overflow-x-auto">
{`// L'utente deve aspettare!
const result = database.save(data);
notify(result); // Bloccato...`}
          </pre>
        </div>

        <div className="p-4 rounded-lg bg-event-success/5 border border-event-success/20">
          <h4 className="text-sm font-semibold text-event-success mb-2">
            ✅ Codice Asincrono (non bloccante)
          </h4>
          <pre className="text-xs text-muted-foreground font-mono overflow-x-auto">
{`// L'utente continua subito!
queue.push(event);
// UI libera, elaborazione in background`}
          </pre>
        </div>
      </div>
    </div>
  );
};
