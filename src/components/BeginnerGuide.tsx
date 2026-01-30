/**
 * BEGINNER GUIDE COMPONENT
 * ========================
 * 
 * Una guida introduttiva per chi è alle prime armi con la programmazione.
 * Spiega i concetti base con analogie della vita reale.
 */

import { Lightbulb, Mail, Clock, Bell, ArrowRight, Coffee } from 'lucide-react';

export const BeginnerGuide = () => {
  return (
    <div className="glass-card p-6 space-y-6">
      {/* Titolo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-event-warning/10 text-event-warning">
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-semibold">Guida per Principianti</span>
        </div>
        <h2 className="text-2xl font-bold">
          Cos'è un sistema di <span className="text-gradient">Eventi e Notifiche</span>?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Immagina un sistema di posta: quando qualcuno ti invia una lettera, 
          non devi stare fermo ad aspettare. Continui la tua giornata e 
          quando la lettera arriva, vieni avvisato!
        </p>
      </div>

      {/* Analogia della vita reale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalogieCard
          icon={<Coffee className="w-8 h-8" />}
          title="Ordini un caffè"
          step="1"
          description="Vai al bar, ordini un caffè. L'ordine è un EVENTO: qualcosa che è successo."
          color="info"
        />
        <AnalogieCard
          icon={<Clock className="w-8 h-8" />}
          title="Il barista lavora"
          step="2"
          description="Non stai fermo! Ti siedi, guardi il telefono. Il caffè si prepara IN BACKGROUND (asincrono)."
          color="warning"
        />
        <AnalogieCard
          icon={<Bell className="w-8 h-8" />}
          title="Ti chiamano"
          step="3"
          description="'Caffè pronto!' - Questa è una NOTIFICA: ti avvisa che qualcosa è stato completato."
          color="success"
        />
      </div>

      {/* Glossario semplice */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          📚 Parole Chiave (in parole semplici)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <GlossaryItem
            term="Evento"
            definition="Qualcosa che succede. Come premere un bottone o fare un ordine."
          />
          <GlossaryItem
            term="Asincrono"
            definition="Non devi aspettare! Puoi fare altro mentre il computer lavora."
          />
          <GlossaryItem
            term="Coda"
            definition="Una fila di cose da fare, come al supermercato. Chi arriva prima, viene servito prima."
          />
          <GlossaryItem
            term="Notifica"
            definition="Un messaggio che ti dice: 'Ehi, è successo qualcosa!'"
          />
        </div>
      </div>

      {/* Come usare questa app */}
      <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          🎮 Come usare questa app
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
            <span><strong className="text-foreground">Clicca un bottone</strong> nel "Generatore Eventi" per simulare un'azione (es. Login, Upload)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
            <span><strong className="text-foreground">Osserva la Coda</strong> - l'evento entra in fila e viene elaborato</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
            <span><strong className="text-foreground">Guarda il Notification Center</strong> - dopo qualche secondo arriva la notifica!</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

// Card per le analogie
const AnalogieCard = ({
  icon,
  title,
  step,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  step: string;
  description: string;
  color: 'info' | 'warning' | 'success';
}) => {
  const colorClasses = {
    info: 'bg-event-info/10 text-event-info border-event-info/30',
    warning: 'bg-event-warning/10 text-event-warning border-event-warning/30',
    success: 'bg-event-success/10 text-event-success border-event-success/30',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} text-center space-y-2`}>
      <div className="flex justify-center">{icon}</div>
      <div className="flex items-center justify-center gap-2">
        <span className="w-6 h-6 rounded-full bg-current/20 text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

// Item del glossario
const GlossaryItem = ({ term, definition }: { term: string; definition: string }) => (
  <div className="flex items-start gap-2">
    <span className="font-mono text-primary font-semibold">{term}:</span>
    <span className="text-muted-foreground">{definition}</span>
  </div>
);
