export { cn } from 'cn';

export function isValidUrl(url: string): boolean {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        // new URL() throws a TypeError when the string is not a valid URL
        return false;
    }
}

export function ensureHttps(url: string): string {
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }

    if (!url.startsWith('https://')) {
        return `https://${url}`;
    }

    return url;
}
