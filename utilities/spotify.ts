import base64 from 'react-native-base64';
import credentials from '../secrets/spotifyCredentials.json';

interface SpotifyToken {
    token?: string;
    expires: number;
}
const currentToken = {
    expires: Date.now(),
} as SpotifyToken;

export const getToken = async () => {
    if (currentToken.token && currentToken.expires > Date.now()) return currentToken.token;

    console.log('fetching new spotify token');
    const requestParam = base64.encode(`${credentials.clientID}:${credentials.clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${requestParam}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    }).then(r => r.json() as Promise<{ expires_in: number, access_token: string }>);

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + response.expires_in - 30);
    currentToken.token = response.access_token;
    currentToken.expires = expires.getTime();

    return currentToken.token;
};

export const search = async (options: { q: string, types: string[], token?: string }) => {
    return await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(options.q)}&type=${encodeURIComponent(options.types.join(','))}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.token || await getToken()}`,
        },
    }).then(r => r.json()) as SpotifySearchResponse;
};

export const getAlbum = async (options: { album: string, token?: string }) => {
    const url = options.album.startsWith('https://api.spotify.com/v1/albums/') ? options.album : `https://api.spotify.com/v1/albums/${options.album}`;
    return await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.token || await getToken()}`,
        },
    }).then(r => r.json()) as SpotifyAlbumDetail;
};

interface SpotifySearchResponse {
    artists?: SpotifyPagedCollection<SpotifyArtist>;
    albums?: SpotifyPagedCollection<SpotifyAlbum>;
    tracks?: SpotifyPagedCollection<SpotifyTrack>;
}

export interface SpotifyPagedCollection<T> {
    items: T[];
    limit: number;
    href: string;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export interface SpotifyAlbum {
    id: string;
    name: string;
    total_tracks: number;
    uri: string;
    href: string;
    artists: SpotifyArtist[];
    images: SpotifyImage[];
}

export interface SpotifyAlbumDetail extends SpotifyAlbum {
    tracks: SpotifyPagedCollection<SpotifyTrack>;
}

export interface SpotifyArtist {
    id: string;
    name: string;
    uri: string;
}

interface SpotifyImage {
    url: string;
    width: number;
    height: number;
}

export interface SpotifyTrack {
    id: string;
    name: string;
    album: SpotifyAlbum;
    artists: SpotifyArtist[];
    explicit: boolean;
    track_number: number;
    uri: string;
}