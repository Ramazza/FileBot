const DEBUG = import.meta.env.VITE_DEBUG === 'true';

const colors: Record<string, string> = {
    Match: 'color: #4CAF50',
    TMDB: 'color: #2196F3',
    TVDB: 'color: #FF9800',
    Main: 'color: #9C27B0',
}

export function createLogger(scope: string) {
    return (...args: unknown[]) => {
        if (!DEBUG) return;

        const style = colors[scope] || 'color: white';

        console.log(`%c[${scope}]`, style, ...args);
    };
}