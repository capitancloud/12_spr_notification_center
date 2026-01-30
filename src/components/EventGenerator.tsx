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
      {/* Header con spiegazione */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Generatore Eventi
        </h2>
        <p className="text-sm text-muted-foreground">
          Clicca un bottone per simulare un'azione dell'utente.
          Ogni click genera un <span className="text-primary font-medium">evento</span> che 
          verrà elaborato in modo <span className="text-accent font-medium">asincrono</span>.
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

      {/* Info box didattico */}
      <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-event-info">// NOTA DIDATTICA:</span><br />
          Quando clicchi un bottone, viene chiamata la funzione{' '}
          <span className="text-primary">dispatchEvent()</span>.<br />
          Questa funzione crea un oggetto evento e lo inserisce nella coda.
        </p>
      </div>
    </div>
  );
};
