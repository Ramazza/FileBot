// Functions that handle cleaning up filenames 

function normalizeName(name: string) {
    const junkRegex =
    /(1080p|720p|2160p|WEBRip|WEB-DL|BluRay|x26[45]|AAC|DDP|HDR|10bit|4K)/i;

    let normalizedName = name  
        .replace(/\.(mkv|mp4|avi|mov)$/i, '')
        .replace(/[._\-[\]]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const cutIndex = normalizedName.search(junkRegex);

    if (cutIndex !== -1) {
        normalizedName = normalizedName.slice(0, cutIndex).trim();
        return normalizedName;
    }

    return normalizedName;
}

// Tries to extract season and episode from filename
// Supports formats like "S01E02" and "1x02"
// Falls back to using the last number in the filename as episode (e.g. anime like "1074")
// Assumes season 01 if no season info is found
export function extractShowName(filename: string, type: 'tv' | 'movie') {

  let normalizedName = normalizeName(filename);

  if (type === 'tv') {
    normalizedName = normalizedName.replace(/S\d{1,2}E\d{1,2}/i, '').trim(); // Remvoes S1E23
    normalizedName = normalizedName.replace(/\d+/, '') // Removes numbers 
  }

  if (type === 'movie') {
    normalizedName = normalizedName.replace(/\(\d{1,4}\)/, '').trim(); // Removes (2019)
  }
  
  return normalizedName.replace(/\s+/g, ' ').trim();
}

// Tries to extract season and episode from filename
// Supports formats like "S01E02" and "1x02"
// Falls back to using the last number in the filename as episode (e.g. anime like "1074")
// Assumes season 01 if no season info is found
export function extractEpisodeInfo(filename: string, path?: string) {

    const name = normalizeName(filename)

    //const name = filename.replace(/\.(mkv|mp4|avi|mov)$/i, '');

    const match =
        name.match(/S(\d{1,2})E(\d{1,2})/i) ||
        name.match(/(\d{1,2})x(\d{1,2})/i);

    if (match) {
        return {
            season: match[1].padStart(2, '0'),
            episode: match[2].padStart(2, '0'),
        };
    }

    const numbers = name.match(/\d{1,4}/g);

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