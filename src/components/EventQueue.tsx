/**
 * EVENT QUEUE VISUALIZATION
 * =========================
 * 
 * Questo componente visualizza la coda degli eventi in elaborazione.
 * 
 * CONCETTO CHIAVE - MESSAGE QUEUE:
 * Una coda di messaggi (o eventi) è un pattern fondamentale nei sistemi
 * distribuiti. Serve a:
 * 
 * 1. DISACCOPPIAMENTO: Chi produce eventi non deve aspettare chi li consuma
 * 2. BUFFERING: Gli eventi possono accumularsi senza perdita
 * 3. ORDERING: Gli eventi sono elaborati in ordine (FIFO)
 * 4. RESILIENZA: Se il consumer è lento, gli eventi non vanno persi
 * 
 * Esempi reali di code: RabbitMQ, AWS SQS, Redis Streams, Apache Kafka
 */

import { AppEvent, getEventTypeInfo } from '@/types/events';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

interface EventQueueProps {
  events: AppEvent[];
  isProcessing: boolean;
}

export const EventQueue = ({ events, isProcessing }: EventQueueProps) => {
  // Mostriamo gli ultimi 5 eventi per non sovraccaricare la UI
  const displayEvents = events.slice(-5);

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Coda Eventi
          {isProcessing && (
            <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />
          )}
        </h2>
        <p className="text-sm text-muted-foreground">
          Gli eventi entrano nella coda e vengono elaborati{' '}
          <span className="text-accent font-medium">uno alla volta</span> in modo asincrono.
        </p>
      </div>

      {/* Visualizzazione coda */}
      <div className="space-y-2 min-h-[120px]">
        {displayEvents.length === 0 ? (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              La coda è vuota. Genera un evento!
            </p>
          </div>
        ) : (
          displayEvents.map((event, index) => (
            <QueueItem key={event.id} event={event} position={index} />
          ))
        )}
      </div>

      {/* Info box didattico */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-event-info">// PATTERN FIFO:</span><br />
          First In, First Out - il primo evento ad entrare è il primo ad uscire.<br />
          <span className="text-primary">pending</span> → <span className="text-event-warning">processing</span> → <span className="text-event-success">completed</span>
        </p>
      </div>
    </div>
  );
};

// Componente per singolo item nella coda
const QueueItem = ({ event, position }: { event: AppEvent; position: number }) => {
  const info = getEventTypeInfo(event.type);
  
  const statusConfig = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      label: 'In attesa',
      className: 'text-muted-foreground',
      bg: 'bg-muted/30',
    },
    processing: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      label: 'Elaborazione...',
      className: 'text-event-warning',
      bg: 'bg-event-warning/10 border-event-warning/30',
    },
    completed: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: 'Completato',
      className: 'text-event-success',
      bg: 'bg-event-success/10 border-event-success/30',
    },
  };

  const status = statusConfig[event.status];

  return (
    <div 
      className={`
        queue-slide p-3 rounded-lg border transition-all duration-300
        ${status.bg}
        ${event.status === 'processing' ? 'scale-[1.02] shadow-lg' : ''}
      `}
      style={{ animationDelay: `${position * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Posizione nella coda */}
          <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-mono">
            {position + 1}
          </span>
          
          {/* Emoji tipo evento */}
          <span className="text-lg">{info.icon}</span>
          
          {/* Info evento */}
          <div>
            <p className="text-sm font-medium">{info.label}</p>
            <p className="text-xs text-muted-foreground font-mono">
              ID: {event.id}
            </p>
          </div>
        </div>

        {/* Badge stato */}
        <div className={`flex items-center gap-1.5 ${status.className}`}>
          {status.icon}
          <span className="text-xs font-medium">{status.label}</span>
        </div>
      </div>
    </div>
  );
};
