/**
 * INFO PANEL COMPONENT
 * ====================
 * 
 * Pannello informativo che spiega i concetti chiave.
 * Mostra anche statistiche in tempo reale sul sistema.
 */

import { AppEvent, Notification } from '@/types/events';
import { BookOpen, Activity, Database, Zap } from 'lucide-react';

interface InfoPanelProps {
  eventHistory: AppEvent[];
  notifications: Notification[];
  isProcessing: boolean;
}

export const InfoPanel = ({ eventHistory, notifications, isProcessing }: InfoPanelProps) => {
  const stats = {
    totalEvents: eventHistory.length,
    pendingEvents: eventHistory.filter(e => e.status === 'pending').length,
    processingEvents: eventHistory.filter(e => e.status === 'processing').length,
    completedEvents: eventHistory.filter(e => e.status === 'completed').length,
    totalNotifications: notifications.length,
    unreadNotifications: notifications.filter(n => n.status === 'unread').length,
  };

  return (
    <div className="space-y-4">
      {/* Statistiche in tempo reale */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-primary" />
          Statistiche Sistema
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Eventi Totali"
            value={stats.totalEvents}
            icon={<Zap className="w-4 h-4" />}
            color="primary"
          />
          <StatCard
            label="In Elaborazione"
            value={stats.processingEvents}
            icon={<Activity className="w-4 h-4" />}
            color="warning"
            pulse={isProcessing}
          />
          <StatCard
            label="Notifiche"
            value={stats.totalNotifications}
            icon={<Database className="w-4 h-4" />}
            color="success"
          />
          <StatCard
            label="Non Lette"
            value={stats.unreadNotifications}
            icon={<BookOpen className="w-4 h-4" />}
            color="error"
          />
        </div>
      </div>

      {/* Concetti Chiave */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-accent" />
          Concetti Chiave
        </h3>

        <div className="space-y-3 text-xs">
          <ConceptCard
            emoji="🎯"
            title="Evento"
            description="Un fatto che è accaduto nel sistema. Immutabile e timestampato."
          />
          <ConceptCard
            emoji="📋"
            title="Coda (Queue)"
            description="Buffer che accumula eventi per elaborazione FIFO."
          />
          <ConceptCard
            emoji="⏱️"
            title="Asincrono"
            description="Elaborazione non bloccante. L'UI rimane reattiva."
          />
          <ConceptCard
            emoji="🔔"
            title="Notifica"
            description="Messaggio generato in risposta a un evento elaborato."
          />
        </div>
      </div>

      {/* Dove vivono i dati */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-event-info" />
          Storage (Simulato)
        </h3>

        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
{`// In questa demo:
const [notifications] = useState([]);
// In memoria, si perde al refresh

// In produzione useresti:
// - PostgreSQL / MySQL
// - Redis per cache
// - Firebase/Supabase
// - Message broker (RabbitMQ)`}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Componente stat card
const StatCard = ({
  label,
  value,
  icon,
  color,
  pulse = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
  pulse?: boolean;
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-event-success bg-event-success/10',
    warning: 'text-event-warning bg-event-warning/10',
    error: 'text-event-error bg-event-error/10',
  };

  return (
    <div className={`
      p-3 rounded-lg border border-border transition-all duration-300
      ${pulse ? 'animate-pulse' : ''}
    `}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`p-1.5 rounded-md ${colorClasses[color]}`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
};

// Componente concept card
const ConceptCard = ({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
    <span className="text-lg">{emoji}</span>
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);
