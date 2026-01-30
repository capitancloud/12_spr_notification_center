/**
 * NOTIFICATION CENTER - TYPE DEFINITIONS
 * ========================================
 * 
 * Questo file definisce i tipi per il nostro sistema di eventi e notifiche.
 * 
 * CONCETTO CHIAVE: In un sistema event-driven, distinguiamo tra:
 * - EVENT: Un fatto che è accaduto (es. "l'utente ha fatto login")
 * - NOTIFICATION: Un messaggio generato in risposta a un evento
 * 
 * Questa separazione permette di:
 * 1. Disaccoppiare chi produce eventi da chi li consuma
 * 2. Elaborare eventi in modo asincrono
 * 3. Generare più notifiche da un singolo evento
 */

// Tipi di eventi supportati dal sistema
export type EventType = 'login' | 'upload' | 'error' | 'success' | 'system';

// Stato di processing di un evento nella coda
export type EventStatus = 'pending' | 'processing' | 'completed';

// Stato di lettura di una notifica
export type NotificationStatus = 'unread' | 'read';

/**
 * EVENTO
 * ------
 * Rappresenta qualcosa che è accaduto nel sistema.
 * Gli eventi sono immutabili: una volta creati, non cambiano.
 */
export interface AppEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: Date;
  status: EventStatus;
}

/**
 * NOTIFICA
 * --------
 * Rappresenta un messaggio generato in risposta a un evento.
 * A differenza degli eventi, le notifiche possono cambiare stato (letta/non letta).
 */
export interface Notification {
  id: string;
  eventId: string; // Collegamento all'evento che ha generato questa notifica
  type: EventType;
  title: string;
  message: string;
  timestamp: Date;
  status: NotificationStatus;
}

/**
 * CONFIGURAZIONE SIMULAZIONE
 * --------------------------
 * Parametri per controllare i ritardi simulati nel sistema.
 * Questi ritardi rendono visibile l'asincronicità del processo.
 */
export interface SimulationConfig {
  // Tempo in ms per l'elaborazione nella coda
  queueProcessingDelay: number;
  // Tempo in ms per generare la notifica
  notificationGenerationDelay: number;
}

// Configurazione di default per la simulazione
export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  queueProcessingDelay: 1500, // 1.5 secondi per elaborare l'evento
  notificationGenerationDelay: 1000, // 1 secondo per generare la notifica
};

/**
 * Funzione helper per ottenere informazioni visive per ogni tipo di evento.
 * Utilizzata per colorare badge, icone e altri elementi UI.
 */
export const getEventTypeInfo = (type: EventType) => {
  const info = {
    login: {
      label: 'Login',
      color: 'info',
      icon: '🔐',
      description: 'Utente ha effettuato l\'accesso',
    },
    upload: {
      label: 'Upload',
      color: 'success',
      icon: '📤',
      description: 'File caricato con successo',
    },
    error: {
      label: 'Errore',
      color: 'error',
      icon: '❌',
      description: 'Si è verificato un errore',
    },
    success: {
      label: 'Successo',
      color: 'success',
      icon: '✅',
      description: 'Operazione completata',
    },
    system: {
      label: 'Sistema',
      color: 'warning',
      icon: '⚙️',
      description: 'Evento di sistema',
    },
  };
  return info[type];
};
