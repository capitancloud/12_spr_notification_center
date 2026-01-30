/**
 * NOTIFICATION CENTER - MAIN PAGE
 * ================================
 * 
 * App didattica per capire eventi, notifiche e processi asincroni.
 * 
 * ARCHITETTURA:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                        APP LAYOUT                           │
 * ├───────────────────────────────┬─────────────────────────────┤
 * │   LEFT COLUMN                 │   RIGHT COLUMN              │
 * │   ├─ Event Generator          │   ├─ Notification Center    │
 * │   ├─ Event Queue              │   └─ Info Panel             │
 * │   └─ Flow Diagram             │                             │
 * └───────────────────────────────┴─────────────────────────────┘
 * 
 * FLUSSO DATI:
 * 1. User clicks button → dispatchEvent()
 * 2. Event enters queue → eventQueue state
 * 3. Queue processor runs → async processing
 * 4. Notification created → notifications state
 * 5. UI updates reactively
 */

import { useEventSystem } from '@/hooks/useEventSystem';
import { EventGenerator } from '@/components/EventGenerator';
import { EventQueue } from '@/components/EventQueue';
import { FlowDiagram } from '@/components/FlowDiagram';
import { NotificationCenter } from '@/components/NotificationCenter';
import { InfoPanel } from '@/components/InfoPanel';
import { Sparkles, Github, BookOpen } from 'lucide-react';

const Index = () => {
  // Hook principale che gestisce tutto il sistema eventi/notifiche
  const {
    eventQueue,
    eventHistory,
    notifications,
    isProcessing,
    unreadCount,
    dispatchEvent,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useEventSystem();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-border rounded-xl p-0.5">
                <div className="bg-card rounded-xl p-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">
                  Notification Center
                </h1>
                <p className="text-xs text-muted-foreground">
                  Eventi e Notifiche • App Didattica
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4">
              <a 
                href="#concepts" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Concetti</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Impara come funzionano gli{' '}
            <span className="text-gradient">Eventi</span> e le{' '}
            <span className="text-gradient">Notifiche</span>
          </h2>
          <p className="text-muted-foreground">
            Un'app interattiva per capire visivamente il flusso event-driven,
            l'elaborazione asincrona e la generazione di notifiche.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Event System */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Generator */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <EventGenerator 
                onDispatchEvent={dispatchEvent}
                disabled={isProcessing && eventQueue.length >= 5}
              />
            </div>

            {/* Event Queue */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <EventQueue 
                events={eventHistory.slice(-5)} 
                isProcessing={isProcessing} 
              />
            </div>

            {/* Flow Diagram */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <FlowDiagram 
                isProcessing={isProcessing}
                hasEvents={eventHistory.length > 0}
              />
            </div>
          </div>

          {/* Right Column - Notifications & Info */}
          <div className="space-y-6">
            {/* Notification Center */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClearAll={clearAll}
              />
            </div>

            {/* Info Panel */}
            <div id="concepts" className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <InfoPanel
                eventHistory={eventHistory}
                notifications={notifications}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              🎓 App didattica per comprendere eventi, code e notifiche asincrone
            </p>
            <p className="mt-2 text-xs font-mono">
              Nessun backend reale • Tutto simulato in memoria • Refresh = reset
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
