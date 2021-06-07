import React from 'react';
import base64 from 'react-native-base64';
import credentials from './secrets/spotifyCredentials.json';

const currentToken = {
    token: null,
    expires: Date.now(),
};

/**
 * 
 * @returns {Promise<string>}
 */
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
    }).then(r => r.json());

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + response.expires_in - 30);
    currentToken.token = response.access_token;
    currentToken.expires = expires.getTime();

    return currentToken.token;
};

/**
 * 
 * @param {Object} options
 * @param {string} options.q
 * @param {string[]} options.types
 * @param {string=} options.token
 * @returns {Promise<SpotifySearchResponse>}
 */
export const search = async ({ q, types, token }) => {
    return await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(types.join(','))}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || await getToken()}`,
        },
    }).then(r => r.json());
};

/**
 * 
 * @param {Object} options
 * @param {string} options.album
 * @param {string=} options.token
 * @returns {Promise<SpotifyAlbum & { tracks: SpotifyPagedCollection<SpotifyTrack> }>}
 */
export const getAlbumTrackList = async ({ album, token }) => {
    const href = album.startsWith('https://api.spotify.com/v1/albums/') ? album : `https://api.spotify.com/v1/albums/${album}`;
    return await fetch(href, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || await getToken()}`,
        },
    }).then(r => r.json());
}

/**
 * @typedef {Object} SpotifySearchResponse
 * @property {SpotifyPagedCollection<SpotifyArtist>=} artists
 * @property {SpotifyPagedCollection<SpotifyAlbum>=} albums
 * @property {SpotifyPagedCollection<SpotifyTrack>=} tracks
 */

/**
 * @template T
 * @typedef {Object} SpotifyPagedCollection
 * @property {T[]} items
 * @property {number} limit
 * @property {string} href
 * @property {string} next
 * @property {number} offset
 * @property {string} previous
 * @property {number} total
 */

/**
 * @typedef {Object} SpotifyAlbum
 * @property {string} id
 * @property {string} name
 * @property {number} total_tracks
 * @property {string} uri
 * @property {string} href
 * @property {SpotifyArtist[]} artists
 * @property {SpotifyImage[]} images
 */

/**
 * @typedef {Object} SpotifyArtist
 * @property {string} id
 * @property {string} name
 * @property {string} uri
 */

/**
 * @typedef {Object} SpotifyImage
 * @property {string} url
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} SpotifyTrack
 * @property {string} id
 * @property {string} name
 * @property {SpotifyAlbum} album
 * @property {SpotifyArtist[]} artists
 * @property {boolean} explicit
 * @property {number} track_number
 * @property {string} uri
 */