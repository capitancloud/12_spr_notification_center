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
import { Clock, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventQueueProps {
  events: AppEvent[];
  isProcessing: boolean;
  onClearQueue?: () => void;
}

export const EventQueue = ({ events, isProcessing, onClearQueue }: EventQueueProps) => {
  // Mostriamo gli ultimi 5 eventi per non sovraccaricare la UI
  const displayEvents = events.slice(-5);
  const pendingCount = events.filter(e => e.status === 'pending').length;

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Coda Eventi
            <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-event-warning/20 text-event-warning rounded-full uppercase">
              Passo 2
            </span>
            {isProcessing && (
              <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />
            )}
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-primary/20 text-primary rounded-full">
                {pendingCount}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Cosa succede qui:</strong> Gli eventi aspettano il loro turno, come in fila al supermercato.
          </p>
        </div>
        
        {/* Clear Queue Button */}
        {onClearQueue && events.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearQueue}
            className="text-xs text-event-error hover:text-event-error hover:bg-event-error/10"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Svuota
          </Button>
        )}
      </div>

      {/* Spiegazione stati */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
          <Clock className="w-3 h-3" /> In attesa = Aspetta il turno
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-event-warning/20 text-event-warning">
          <Loader2 className="w-3 h-3" /> Elaborazione = Il sistema sta lavorando
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-event-success/20 text-event-success">
          <CheckCircle2 className="w-3 h-3" /> Completato = Fatto!
        </span>
      </div>

      {/* Visualizzazione coda */}
      <div className="space-y-2 min-h-[100px]">
        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              👆 La coda è vuota. Clicca un bottone sopra!
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
