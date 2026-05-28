// Functions that handle cleaning up filenames 

// Tries to extract season and episode from filename
// Supports formats like "S01E02" and "1x02"
// Falls back to using the last number in the filename as episode (e.g. anime like "1074")
// Assumes season 01 if no season info is found
export function extractShowName(filename: string, type: string) {

    let result = filename;

    if (type === 'tv') {
        result = result
            .replace(/\.(mkv|mp4|avi|mov)$/i, '')
            .split(/ - |_-_/)[0] 
            .replace(/S\d+E\d+/i, '') 
            .replace(/IMAX|WEBRIP|AAC5|YTS|BZ]|kayoanime/gi, '')
            .replace(/1-\[/gi, '') 
            .replace(/YTS/gi, '') 
            .replace(/\d{3,4}p/gi, '') 
            .replace(/x264|x265/gi, '') 
            .replace(/[[]]/g, '')
    } 

    if (type === 'movie') {
        result = result
            .replace(/\b(19|20)\d{2}\b/g, '') 
            .replace(/\.(mkv|mp4|avi|mov)$/i, '')
            .split(/ - |_-_/)[0] 
            .replace(/S\d+E\d+/i, '') 
            .replace(/IMAX|WEBRIP|AAC5|YTS|BZ]/gi, '')
            .replace(/1-\[/gi, '') 
            .replace(/YTS/gi, '') 
            .replace(/\d{3,4}p/gi, '') 
            .replace(/x264|x265/gi, '') 
            .replace(/[[]]/g, '')
        }

     result = result
        .replace(/\./g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return result;
}

// Tries to extract season and episode from filename
// Supports formats like "S01E02" and "1x02"
// Falls back to using the last number in the filename as episode (e.g. anime like "1074")
// Assumes season 01 if no season info is found
export function extractEpisodeInfo(filename: string, path?: string) {

    const name = filename.replace(/\.(mkv|mp4|avi|mov)$/i, '');

    const match =
        name.match(/S(\d{1,2})E(\d{1,2})/i) ||
        name.match(/(\d{1,2})x(\d{1,2})/i);

    if (match) {
        return {
            season: match[1].padStart(2, '0'),
            episode: match[2].padStart(2, '0'),
        };
    }

    const clean = name
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/kayoanime/gi, '')
        .replace(/x264|x265/gi, '')
        .replace(/\d{3,4}p/gi, '')
        .replace(/bluray|webrip|web-dl/gi, '')
        .trim();

    const numbers = clean.match(/\d{1,4}/g);

    if (numbers && numbers.length > 0) {
        const episode = numbers[numbers.length - 1];

        const seasonFromFolder = extractSeasonFromFolder(path);

        return {
            season: seasonFromFolder ?? '01',
            episode: episode.padStart(2, '0'),
        };
    }

    return undefined;
}

export function extractSeasonFromFolder(path?: string): string | undefined {
    if (!path) return;

    const match = 
        path.match(/season[\s._-]?(\d{1,2})/i) ||
        path.match(/s(\d{1,2})/i) ||
        path.match(/temporada[\s._-]?(\d{1,2})/i);

    return match ? match[1].padStart(2, '0') : undefined;
        
}

// Extracts file extension including the dot (".mkv", ".mp4")
// Returns empty string if no extension is found
export function getExtension(filename: string) {
    const match = filename.match(/\.(mkv|mp4|avi|mov)$/i);
    return match ? match[0].toLocaleLowerCase() : '';
}