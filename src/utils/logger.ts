/**
 * Logger mínimo. Si en una fase posterior el proyecto necesita algo más
 * robusto (niveles, transporte a un colector, etc.), este es el único
 * archivo que habría que reemplazar.
 */
export const logger = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};
