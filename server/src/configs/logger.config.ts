// Workers Logs collects console output; one JSON object per line keeps it queryable.
type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function minLevel(): number {
  const configured = process.env.LOG_LEVEL as Level | undefined;
  if (configured && configured in LEVELS) return LEVELS[configured];
  return process.env.NODE_ENV === 'production' ? LEVELS.info : LEVELS.debug;
}

function serialize(meta: unknown): unknown {
  if (meta instanceof Error) return { name: meta.name, message: meta.message, stack: meta.stack };
  if (meta && typeof meta === 'object') {
    return Object.fromEntries(
      Object.entries(meta).map(([k, v]) => [k, v instanceof Error ? serialize(v) : v])
    );
  }
  return meta;
}

function write(level: Level, message: string, meta?: unknown) {
  if (LEVELS[level] < minLevel()) return;
  const entry = { level, message, time: new Date().toISOString(), ...(meta !== undefined && { meta: serialize(meta) }) };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, meta?: unknown) => write('debug', message, meta),
  info: (message: string, meta?: unknown) => write('info', message, meta),
  warn: (message: string, meta?: unknown) => write('warn', message, meta),
  error: (message: string, meta?: unknown) => write('error', message, meta),
};

// Request/response logs used to go to separate files; on Workers they share the console.
export const requestFileLogger = logger;
export const responseFileLogger = logger;

export default logger;
