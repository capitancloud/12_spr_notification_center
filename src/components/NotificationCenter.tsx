/**
 * NOTIFICATION CENTER COMPONENT
 * =============================
 * 
 * Il cuore dell'interfaccia utente per le notifiche.
 * 
 * CONCETTO CHIAVE - UI REATTIVA:
 * Questo componente "reagisce" ai cambiamenti di stato.
 * Quando arriva una nuova notifica, il componente si aggiorna
 * automaticamente grazie a React.
 * 
 * In un sistema reale, le notifiche potrebbero arrivare via:
 * - WebSocket (push in tempo reale)
 * - Server-Sent Events (SSE)
 * - Polling periodico
 * - Service Workers (anche offline)
 */

import { Notification, getEventTypeInfo } from '@/types/events';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenter = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationCenterProps) => {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header con badge */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-event-error text-white text-xs font-bold rounded-full flex items-center justify-center notification-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Notification Center</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-event-success/20 text-event-success rounded-full uppercase">
                Passo 3
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {notifications.length === 0 
                ? '👆 Qui arriveranno le notifiche' 
                : `${notifications.length} notifiche • ${unreadCount} non lette`}
            </p>
          </div>
        </div>

        {/* Azioni globali */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Leggi tutte
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="text-xs text-event-error hover:text-event-error"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Pulisci
          </Button>
        </div>
      </div>

      {/* Lista notifiche */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm font-medium">
              Nessuna notifica
            </p>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Quando un evento viene elaborato, qui comparirà una notifica! 
              <br />Prova a cliccare un bottone sopra 👆
            </p>
          </div>
        ) : (
          <>
            <div className="p-2 bg-event-info/5 border-b border-border">
              <p className="text-xs text-event-info text-center">
                💡 <strong>Suggerimento:</strong> Clicca su una notifica per segnarla come letta!
              </p>
            </div>
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer didattico */}
      <div className="p-3 border-t border-border bg-secondary/20">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-event-info">// STORAGE:</span>{' '}
          Notifiche in memoria (mock). In produzione: database o Redis.
        </p>
      </div>
    </div>
  );
};

// Componente per singola notifica
const NotificationItem = ({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => {
  const info = getEventTypeInfo(notification.type);
  const isUnread = notification.status === 'unread';

  return (
    <div
      className={`
        notification-enter p-4 transition-all duration-300 cursor-pointer
        hover:bg-secondary/50
        ${isUnread ? 'bg-primary/5' : ''}
      `}
      onClick={() => isUnread && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        {/* Indicatore non letto */}
        <div className="flex-shrink-0 mt-1">
          {isUnread ? (
            <span className="w-2 h-2 bg-primary rounded-full block" />
          ) : (
            <Check className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Icona tipo */}
        <span className="text-2xl flex-shrink-0">{info.icon}</span>

        {/* Contenuto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`event-badge-${info.color}`}>
              {info.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, { 
                addSuffix: true,
                locale: it 
              })}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {notification.title}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground/50 font-mono mt-2">
            Event ID: {notification.eventId}
          </p>
        </div>
      </div>
    </div>
  );
};
