/**
 * LIVE EXPLANATION COMPONENT
 * ==========================
 * 
 * Mostra in tempo reale cosa sta succedendo nel sistema.
 * Aiuta i principianti a capire il flusso degli eventi.
 */

import { AppEvent, Notification } from '@/types/events';
import { MessageCircle, ArrowRight, Loader2 } from 'lucide-react';

interface LiveExplanationProps {
  eventHistory: AppEvent[];
  notifications: Notification[];
  isProcessing: boolean;
}

export const LiveExplanation = ({ eventHistory, notifications, isProcessing }: LiveExplanationProps) => {
  // Determina cosa sta succedendo in questo momento
  const getExplanation = () => {
    const lastEvent = eventHistory[eventHistory.length - 1];
    const processingEvent = eventHistory.find(e => e.status === 'processing');
    const pendingEvents = eventHistory.filter(e => e.status === 'pending');

    if (!lastEvent) {
      return {
        emoji: '👋',
        title: 'Pronto per iniziare!',
        description: 'Clicca uno dei bottoni sopra per generare il tuo primo evento.',
        status: 'idle',
      };
    }

    if (processingEvent) {
      return {
        emoji: '⚙️',
        title: 'Elaborazione in corso...',
        description: `Il sistema sta elaborando l'evento "${processingEvent.type}". 
                      Nota come l'interfaccia rimane reattiva! Questo è il vantaggio del codice ASINCRONO.`,
        status: 'processing',
      };
    }

    if (pendingEvents.length > 0) {
      return {
        emoji: '📋',
        title: `${pendingEvents.length} eventi in coda`,
        description: 'Gli eventi aspettano il loro turno. Come al supermercato: chi arriva prima, viene servito prima (FIFO).',
        status: 'pending',
      };
    }

    if (notifications.length > 0) {
      const lastNotification = notifications[0];
      return {
        emoji: '✅',
        title: 'Evento completato!',
        description: `L'evento è stato elaborato e ha generato una notifica: "${lastNotification.title}". 
                      Clicca sulla notifica per segnarla come letta.`,
        status: 'completed',
      };
    }

    return {
      emoji: '🎯',
      title: 'Sistema pronto',
      description: 'Genera un nuovo evento per vedere il flusso completo.',
      status: 'ready',
    };
  };

  const explanation = getExplanation();

  const statusColors = {
    idle: 'border-muted-foreground/30',
    processing: 'border-event-warning/50 bg-event-warning/5',
    pending: 'border-event-info/50 bg-event-info/5',
    completed: 'border-event-success/50 bg-event-success/5',
    ready: 'border-primary/50 bg-primary/5',
  };

  return (
    <div className={`glass-card p-4 border-2 ${statusColors[explanation.status as keyof typeof statusColors]}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0">
          {isProcessing ? (
            <div className="flex items-center justify-center w-10 h-10">
              <Loader2 className="w-8 h-8 animate-spin text-event-warning" />
            </div>
          ) : (
            explanation.emoji
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Cosa sta succedendo?</h3>
          </div>
          <p className="font-medium text-foreground">{explanation.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{explanation.description}</p>
        </div>
      </div>

      {/* Mini flow indicator */}
      {isProcessing && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-event-info/20 text-event-info">Evento</span>
          <ArrowRight className="w-4 h-4 text-event-warning animate-pulse" />
          <span className="px-2 py-1 rounded bg-event-warning/20 text-event-warning">Elaborazione</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="px-2 py-1 rounded bg-muted text-muted-foreground">Notifica</span>
        </div>
      )}
    </div>
  );
};
