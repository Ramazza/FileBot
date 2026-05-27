const DEBUG = import.meta.env.VITE_DEBUG === 'true';

const baseColors: Record<string, string> = {
    Match: 'color: #4CAF50',
    TMDB: 'color: #2196F3',
    TVDB: 'color: #FF9800',
    Main: 'color: #9C27B0',
    FileName: 'color: #9E9E9E',
};

const levelStyles = {
    info: '',
    success: 'color: #4CAF50',
    warn: 'color: #FF9800',
    error: 'color: #F44336; font-weight: bold',
    debug: 'color: #607D8B',
};

export function createLogger(scope: string) {
    const scopeStyle = baseColors[scope] || 'color: white';

    function logWith(level: keyof typeof levelStyles, ...args: unknown[]) {
        
        if (level === 'debug' && !DEBUG) return;

        const levelStyle = levelStyles[level];

        console.log(
            `%c[${scope}]%c[${level.toUpperCase()}]`,
            scopeStyle,
            levelStyle,
            ...args
        );
    }

    return {
        info: (...args: unknown[]) => logWith('info', ...args),
        success: (...args: unknown[]) => logWith('success', ...args),
        warn: (...args: unknown[]) => logWith('warn', ...args),
        error: (...args: unknown[]) => logWith('error', ...args),
        debug: (...args: unknown[]) => logWith('debug', ...args),
    };
}