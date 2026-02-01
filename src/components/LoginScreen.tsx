/**
 * LOGIN SCREEN
 * ============
 * 
 * Schermata di accesso con inserimento codice.
 * Il codice viene verificato tramite hash SHA-256.
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!code.trim()) {
      setError('Inserisci il codice di accesso');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(code.trim());
      if (!success) {
        setError('Codice di accesso non valido');
      }
    } catch (err) {
      setError('Errore durante la verifica del codice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gradient-border rounded-xl p-0.5 mb-4">
            <div className="bg-card rounded-xl p-4">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gradient mb-2">
            Notification Center
          </h1>
          <p className="text-muted-foreground text-sm">
            🎓 App Didattica per Eventi e Notifiche
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Accesso Riservato</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Codice di Accesso</Label>
              <div className="relative">
                <Input
                  id="accessCode"
                  type={showCode ? 'text' : 'password'}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  placeholder="Inserisci il codice..."
                  className="pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCode ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifica in corso...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Accedi
                </>
              )}
            </Button>
          </form>

          {/* Info didattica */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <span>🔐</span>
              Come funziona?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Il codice inserito viene trasformato in un <strong>hash</strong> (una stringa cifrata) 
              e confrontato con l'hash del codice corretto. Questo sistema è più sicuro perché 
              il codice originale non viene mai salvato!
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          ⚠️ Se non hai il codice, contatta l'amministratore
        </p>
      </div>
    </div>
  );
};
