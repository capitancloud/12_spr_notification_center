/**
 * EVENT GENERATOR COMPONENT
 * =========================
 * 
 * Questo componente simula le azioni dell'utente che generano eventi.
 * 
 * CONCETTO CHIAVE - EVENT PRODUCER:
 * In un sistema event-driven, un "producer" è qualsiasi componente
 * che può generare eventi. In un'app reale, gli eventi potrebbero
 * essere generati da:
 * - Form submissions
 * - Button clicks
 * - API responses
 * - Timer/scheduler
 * - WebSocket messages
 */

import { EventType, getEventTypeInfo } from '@/types/events';
import { Button } from '@/components/ui/button';
import { LogIn, Upload, AlertCircle, CheckCircle, Settings } from 'lucide-react';

interface EventGeneratorProps {
  onDispatchEvent: (type: EventType, title: string, description: string) => void;
  disabled?: boolean;
}

// Configurazione dei bottoni per ogni tipo di evento
const eventButtons: {
  type: EventType;
  icon: React.ReactNode;
  action: string;
  description: string;
}[] = [
  {
    type: 'login',
    icon: <LogIn className="w-5 h-5" />,
    action: 'Simula Login',
    description: 'L\'utente Mario Rossi ha effettuato l\'accesso al sistema',
  },
  {
    type: 'upload',
    icon: <Upload className="w-5 h-5" />,
    action: 'Simula Upload',
    description: 'Il file "documento.pdf" è stato caricato con successo',
  },
  {
    type: 'error',
    icon: <AlertCircle className="w-5 h-5" />,
    action: 'Simula Errore',
    description: 'Connessione al server fallita. Riprova tra qualche istante.',
  },
  {
    type: 'success',
    icon: <CheckCircle className="w-5 h-5" />,
    action: 'Simula Successo',
    description: 'L\'operazione richiesta è stata completata con successo',
  },
  {
    type: 'system',
    icon: <Settings className="w-5 h-5" />,
    action: 'Evento Sistema',
    description: 'Aggiornamento di sistema completato. Versione 2.1.0',
  },
];

export const EventGenerator = ({ onDispatchEvent, disabled }: EventGeneratorProps) => {
  const handleClick = (button: typeof eventButtons[0]) => {
    const info = getEventTypeInfo(button.type);
    
    // Questo è il momento in cui "nasce" l'evento!
    // Il click dell'utente viene trasformato in un evento strutturato
    console.log(`🖱️ [UI] Click rilevato, generando evento: ${button.type}`);
    
    onDispatchEvent(button.type, info.description, button.description);
  };

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Header con spiegazione per principianti */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Generatore Eventi
          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-event-info/20 text-event-info rounded-full uppercase">
            Passo 1
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Cosa fare:</strong> Clicca uno dei bottoni qui sotto per simulare un'azione.
        </p>
        <p className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
          💡 <strong>Esempio reale:</strong> In un'app vera, un evento si genera quando 
          fai login, carichi un file, o completi un acquisto. Qui simuliamo queste azioni!
        </p>
      </div>

      {/* Griglia bottoni eventi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {eventButtons.map((button) => {
          const info = getEventTypeInfo(button.type);
          return (
            <Button
              key={button.type}
              variant="outline"
              className={`
                h-auto py-4 px-3 flex flex-col items-center gap-2 
                border-2 transition-all duration-300
                hover:scale-105 hover:border-primary hover:glow-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                ${button.type === 'error' ? 'hover:border-event-error hover:glow-error' : ''}
                ${button.type === 'success' || button.type === 'upload' ? 'hover:border-event-success hover:glow-success' : ''}
              `}
              onClick={() => handleClick(button)}
              disabled={disabled}
            >
              <span className={`
                p-2 rounded-lg
                ${button.type === 'login' ? 'bg-event-info/20 text-event-info' : ''}
                ${button.type === 'upload' ? 'bg-event-success/20 text-event-success' : ''}
                ${button.type === 'error' ? 'bg-event-error/20 text-event-error' : ''}
                ${button.type === 'success' ? 'bg-event-success/20 text-event-success' : ''}
                ${button.type === 'system' ? 'bg-event-warning/20 text-event-warning' : ''}
              `}>
                {button.icon}
              </span>
              <span className="text-xs font-medium text-center">
                {button.action}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Spiegazione semplice */}
      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-foreground">
          <span className="text-lg mr-2">🤔</span>
          <strong>Cosa succede quando clicchi?</strong>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Il tuo click diventa un "evento" - un messaggio che dice al sistema: 
          "Ehi, è successo qualcosa!". L'evento viene messo in fila (coda) 
          per essere elaborato.
        </p>
      </div>
    </div>
  );
};
