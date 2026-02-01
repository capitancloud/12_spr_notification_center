/**
 * AUTH UTILITIES
 * ==============
 * 
 * Gestisce l'autenticazione tramite codice di accesso.
 * Il codice viene confrontato usando un hash SHA-256 per sicurezza.
 */

// Il codice di accesso originale (usato solo per generare l'hash)
const ACCESS_CODE = 'gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E';

// Variable per memorizzare l'hash calcolato
let validCodeHash: string | null = null;

/**
 * Genera un hash SHA-256 di una stringa
 */
export async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Inizializza l'hash del codice valido (chiamato all'avvio)
 */
async function initializeValidHash(): Promise<string> {
  if (!validCodeHash) {
    validCodeHash = await hashCode(ACCESS_CODE);
  }
  return validCodeHash;
}

/**
 * Verifica se il codice inserito è corretto
 */
export async function verifyAccessCode(inputCode: string): Promise<boolean> {
  const validHash = await initializeValidHash();
  const inputHash = await hashCode(inputCode);
  // Confrontiamo gli hash
  return inputHash === validHash;
}

// Chiave per localStorage
const AUTH_STORAGE_KEY = 'notification_center_auth';

/**
 * Salva lo stato di autenticazione
 */
export function saveAuthState(isAuthenticated: boolean): void {
  if (isAuthenticated) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

/**
 * Recupera lo stato di autenticazione
 */
export function getAuthState(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

/**
 * Effettua il logout
 */
export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
