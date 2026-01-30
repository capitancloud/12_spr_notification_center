/**
 * HOOK: useEventSystem
 * ====================
 * 
 * Questo hook gestisce l'intero ciclo di vita degli eventi e delle notifiche.
 * 
 * FLUSSO PRINCIPALE:
 * 1. dispatchEvent() → Crea un nuovo evento
 * 2. L'evento entra nella CODA (queue) con stato "pending"
 * 3. processQueue() elabora gli eventi in modo ASINCRONO
 * 4. Ogni evento elaborato genera una NOTIFICA
 * 5. La notifica viene salvata in memoria
 * 
 * CONCETTO CHIAVE - ASINCRONICITÀ:
 * --------------------------------
 * Nota come il codice usa setTimeout per simulare ritardi.
 * In un sistema reale, questi ritardi rappresenterebbero:
 * - Chiamate API
 * - Operazioni di database
 * - Comunicazioni di rete
 * 
 * Il pattern Promise + setTimeout simula operazioni I/O non bloccanti.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  AppEvent, 
  Notification, 
  EventType, 
  DEFAULT_SIMULATION_CONFIG,
  SimulationConfig 
} from '@/types/events';

// Generatore di ID univoci
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useEventSystem = (config: SimulationConfig = DEFAULT_SIMULATION_CONFIG) => {
  // === STATO DELL'APPLICAZIONE ===
  // In un sistema reale, questi dati vivrebbero in un database
  
  // Coda degli eventi in attesa di elaborazione
  const [eventQueue, setEventQueue] = useState<AppEvent[]>([]);
  
  // Storico di tutti gli eventi (per visualizzazione)
  const [eventHistory, setEventHistory] = useState<AppEvent[]>([]);
  
  // Notifiche generate dagli eventi
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Flag per indicare se il sistema sta elaborando
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Riferimento per il timeout del processore
  const processingRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * DISPATCH EVENT
   * ==============
   * Questo è il punto di ingresso: dove "nasce" un evento.
   * 
   * In un'app reale, questa funzione verrebbe chiamata quando:
   * - L'utente completa un'azione (login, upload, ecc.)
   * - Il sistema rileva una condizione (errore, timeout, ecc.)
   * - Un processo in background termina
   */
  const dispatchEvent = useCallback((type: EventType, title: string, description: string) => {
    // Creiamo l'evento con tutti i metadati necessari
    const newEvent: AppEvent = {
      id: generateId(),
      type,
      title,
      description,
      timestamp: new Date(),
      status: 'pending', // L'evento inizia sempre come "pending"
    };

    console.log(`📣 [EVENT DISPATCHER] Nuovo evento creato:`, newEvent);

    // Aggiungiamo l'evento alla coda
    // NOTA: In React, usiamo il pattern funzionale per aggiornare lo stato
    // quando il nuovo valore dipende dal valore precedente
    setEventQueue(prev => [...prev, newEvent]);
    setEventHistory(prev => [...prev, newEvent]);

    return newEvent;
  }, []);

  /**
   * PROCESS QUEUE
   * =============
   * Elabora il prossimo evento nella coda.
   * 
   * CONCETTO CHIAVE - CODA DI EVENTI:
   * Una coda garantisce che gli eventi siano elaborati in ordine (FIFO).
   * Questo è importante per:
   * 1. Mantenere la coerenza temporale
   * 2. Non sovraccaricare il sistema
   * 3. Permettere retry in caso di errori
   */
  const processQueue = useCallback(async () => {
    setEventQueue(currentQueue => {
      if (currentQueue.length === 0) {
        setIsProcessing(false);
        return currentQueue;
      }

      // Prendiamo il primo evento (FIFO - First In, First Out)
      const [eventToProcess, ...remainingQueue] = currentQueue;

      // Iniziamo l'elaborazione in modo ASINCRONO
      // Il setTimeout simula un'operazione che richiede tempo
      setTimeout(() => {
        console.log(`⚙️ [QUEUE PROCESSOR] Elaborazione evento:`, eventToProcess.id);

        // Aggiorniamo lo stato dell'evento a "processing"
        setEventHistory(prev => 
          prev.map(e => 
            e.id === eventToProcess.id 
              ? { ...e, status: 'processing' as const }
              : e
          )
        );

        // Dopo un altro ritardo, generiamo la notifica
        setTimeout(() => {
          console.log(`✅ [QUEUE PROCESSOR] Evento completato:`, eventToProcess.id);

          // Aggiorniamo lo stato dell'evento a "completed"
          setEventHistory(prev => 
            prev.map(e => 
              e.id === eventToProcess.id 
                ? { ...e, status: 'completed' as const }
                : e
            )
          );

          // GENERAZIONE NOTIFICA
          // Questo è il momento in cui l'evento diventa una notifica visibile all'utente
          const notification: Notification = {
            id: generateId(),
            eventId: eventToProcess.id,
            type: eventToProcess.type,
            title: eventToProcess.title,
            message: eventToProcess.description,
            timestamp: new Date(),
            status: 'unread',
          };

          console.log(`🔔 [NOTIFICATION HANDLER] Nuova notifica:`, notification);
          setNotifications(prev => [notification, ...prev]);

          // Continuiamo ad elaborare la coda
          processQueue();
        }, config.notificationGenerationDelay);

      }, config.queueProcessingDelay);

      return remainingQueue;
    });
  }, [config]);

  // Avvia automaticamente l'elaborazione quando ci sono eventi in coda
  useEffect(() => {
    if (eventQueue.length > 0 && !isProcessing) {
      setIsProcessing(true);
      processQueue();
    }
  }, [eventQueue.length, isProcessing, processQueue]);

  /**
   * MARK AS READ
   * ============
   * Marca una notifica come letta.
   * 
   * A differenza degli eventi (immutabili), le notifiche possono
   * cambiare stato. Questo riflette un pattern comune:
   * - Gli EVENTI sono fatti storici (non cambiano)
   * - Le NOTIFICHE sono messaggi per l'utente (possono essere gestite)
   */
  const markAsRead = useCallback((notificationId: string) => {
    console.log(`👁️ [NOTIFICATION] Segnata come letta:`, notificationId);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, status: 'read' as const }
          : n
      )
    );
  }, []);

  /**
   * MARK ALL AS READ
   * ================
   * Marca tutte le notifiche come lette.
   */
  const markAllAsRead = useCallback(() => {
    console.log(`👁️ [NOTIFICATION] Tutte segnate come lette`);
    setNotifications(prev =>
      prev.map(n => ({ ...n, status: 'read' as const }))
    );
  }, []);

  /**
   * CLEAR ALL
   * =========
   * Pulisce tutte le notifiche.
   */
  const clearAll = useCallback(() => {
    console.log(`🗑️ [NOTIFICATION] Tutte le notifiche eliminate`);
    setNotifications([]);
  }, []);

  // Conteggio notifiche non lette (per il badge)
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Cleanup al unmount
  useEffect(() => {
    return () => {
      if (processingRef.current) {
        clearTimeout(processingRef.current);
      }
    };
  }, []);

  return {
    // Stato
    eventQueue,
    eventHistory,
    notifications,
    isProcessing,
    unreadCount,
    
    // Azioni
    dispatchEvent,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
};
