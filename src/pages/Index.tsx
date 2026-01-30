/**
 * NOTIFICATION CENTER - MAIN PAGE
 * ================================
 * 
 * App didattica per capire eventi, notifiche e processi asincroni.
 * Versione per principianti con spiegazioni semplificate.
 */

import { useEventSystem } from '@/hooks/useEventSystem';
import { EventGenerator } from '@/components/EventGenerator';
import { EventQueue } from '@/components/EventQueue';
import { FlowDiagram } from '@/components/FlowDiagram';
import { NotificationCenter } from '@/components/NotificationCenter';
import { BeginnerGuide } from '@/components/BeginnerGuide';
import { LiveExplanation } from '@/components/LiveExplanation';
import { Sparkles, BookOpen, GraduationCap } from 'lucide-react';

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
    clearQueue,
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
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">
                  Notification Center
                </h1>
                <p className="text-xs text-muted-foreground">
                  🎓 Impara gli Eventi e le Notifiche
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4">
              <a 
                href="#guide" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Guida</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6">
        {/* Titolo principale */}
        <div className="text-center max-w-3xl mx-auto mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">App Didattica Interattiva</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Impara come funzionano{' '}
            <span className="text-gradient">Eventi</span> e{' '}
            <span className="text-gradient">Notifiche</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Non preoccuparti se non sai programmare! Questa app ti spiega 
            tutto passo per passo con esempi semplici. 👇
          </p>
        </div>

        {/* Guida per Principianti */}
        <div id="guide" className="mb-8 animate-slide-up">
          <BeginnerGuide />
        </div>

        {/* Spiegazione Live - Cosa sta succedendo */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <LiveExplanation
            eventHistory={eventHistory}
            notifications={notifications}
            isProcessing={isProcessing}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Event System */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Generator */}
            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
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
                onClearQueue={clearQueue}
              />
            </div>

            {/* Flow Diagram */}
            <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <FlowDiagram 
                isProcessing={isProcessing}
                hasEvents={eventHistory.length > 0}
              />
            </div>
          </div>

          {/* Right Column - Notifications */}
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

            {/* Riassunto didattico */}
            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-lg">📝</span>
                Cosa hai imparato
              </h3>
              <ul className="space-y-2 text-sm">
                <LearnedItem 
                  done={eventHistory.length > 0}
                  text="Un EVENTO è qualcosa che succede (es. click)"
                />
                <LearnedItem 
                  done={eventHistory.some(e => e.status === 'processing' || e.status === 'completed')}
                  text="La CODA mette in fila gli eventi"
                />
                <LearnedItem 
                  done={notifications.length > 0}
                  text="Le NOTIFICHE avvisano quando qualcosa è pronto"
                />
                <LearnedItem 
                  done={notifications.some(n => n.status === 'read')}
                  text="Le notifiche possono essere lette"
                />
              </ul>
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
            <p className="mt-2 text-xs">
              ⚠️ <strong>Nota:</strong> Tutto è simulato! Se aggiorni la pagina, i dati scompaiono.
              In un'app reale, i dati verrebbero salvati in un database.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente per il checklist "cosa hai imparato"
const LearnedItem = ({ done, text }: { done: boolean; text: string }) => (
  <li className={`flex items-center gap-2 ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
    <span className={`
      w-5 h-5 rounded-full flex items-center justify-center text-xs
      ${done ? 'bg-event-success/20 text-event-success' : 'bg-muted'}
    `}>
      {done ? '✓' : '○'}
    </span>
    <span className={done ? '' : 'opacity-60'}>{text}</span>
  </li>
);

export default Index;
