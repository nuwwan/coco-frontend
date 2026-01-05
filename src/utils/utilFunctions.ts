/**
 * Utility function to ensure URL has trailing slash for Django compatibility
 * @param path - The URL path to ensure has a trailing slash
 * @returns The URL path with a trailing slash
*/
export function withSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}