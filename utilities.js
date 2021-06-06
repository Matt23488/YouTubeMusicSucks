import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';

// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
/**
 * 
 * @param {string} s1
 * @param {string} s2
 * @returns {number}
 */
export const calculateStringCloseness = (s1, s2) => {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};

const editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

// /**
//  * @template T
//  * @param {T[]} others
//  * @param {(obj: T) => string} accessor 
//  * @param {boolean=} descending 
//  * @returns {(a: T, b: T) => number}
//  */
// export const getClosenessOrdering = (others, accessor, descending = true) => {
//     let i = 0;
//     return (a, b) => {
//         const aMatch = calculateStringCloseness(accessor(a), others[i])
//     }
// };

/**
 * @template T
 * @param {T[]} arrA 
 * @param {T[] | string[] | string} arrB 
 * @param {(obj: T) => string} [accessor]
 * @param {boolean=} descending 
 * @returns {T[]}
 */
export const orderByCloseness = (arrA, arrB, accessor = obj => obj, descending = true) => {
    /** @type {(i: number) => string} */
    const getComparisonVal = i => {
        if (typeof arrB === 'string') return arrB;
        if (typeof arrB[i] === 'string') return arrB[i];
        return accessor(arrB[i]);
    };

    return arrA.map((obj, i) => ({
        obj,
        closeNess: calculateStringCloseness(accessor(obj), getComparisonVal(i))
    })).sort((a, b) => a.closeNess - b.closeNess * descending ? 1 : -1)
    .map(({ obj }) => obj);
};

/** @type {YtmsData} */
const storedData = { tracks: [], albums: [], artists: [], playlists: [] };

const storageKey = 'ytmsStorageKey';
AsyncStorage.getItem(storageKey, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    if (res) {
        /** @type {YtmsData} */
        const parsed = JSON.parse(res);
        storedData.tracks = parsed.tracks;
        storedData.albums = parsed.albums;
        storedData.artists = parsed.artists;
        storedData.playlists = parsed.playlists;
    }
});

/**
 * @typedef {Object} YtmsData
 * @property {YtmsTrack[]} tracks
 * @property {YtmsAlbum[]} albums
 * @property {YtmsArtist[]} artists
 * @property {YtmsPlaylist[]} playlists
 */

/**
 * @typedef {Object} YtmsTrack
 * @property {string} trackID
 * @property {string} spotifyID
 * @property {string} albumID
 * @property {string} artistID
 * @property {string} albumName
 * @property {string} artistName
 * @property {string} filePath
 */

/**
 * @typedef {Object} YtmsAlbum
 * @property {string} albumID
 * @property {string} spotifyID
 * @property {string} artistID
 * @property {string} artistName
 * @property {string[]} tracks
 * @property {string} artworkURL
 */

/**
 * @typedef {Object} YtmsArtist
 * @property {string} artistID
 * @property {string} spotifyID
 * @property {string[]} albums
 */

/**
 * @typedef {Object} YtmsPlaylist
 * @property {string} playlistID
 * @property {string[]} tracks
 */

/**
 * 
 * @param  {...string} trackIDs 
 * @returns {YtmsTrack[]}
 */
export const getTracks = (...trackIDs) => storedData.tracks.filter(t => trackIDs.includes(t.trackID));

/**
 * 
 * @param  {...string} albumIDs 
 * @returns {YtmsAlbum[]}
 */
export const getAlbums = (...albumIDs) => storedData.albums.filter(a => albumIDs.includes(a.albumID));

/**
 * 
 * @param  {...string} artistIDs 
 * @returns {YtmsArtist[]}
 */
export const getArtists = (...artistIDs) => storedData.artists.filter(a => artistIDs.includes(a.artistID));

/**
 * 
 * @param  {...string} playlistIDs 
 * @returns {YtmsPlaylist[]}
 */
export const getPlaylists = (...playlistIDs) => storedData.playlists.filter(p => playlistIDs.includes(p.playlistID));

export const getUnorganizedTracks = () => RNAndroidAudioStore.getSongs().then(songs => songs.filter(s => !storedData.tracks.find(t => t.trackID === s.id)));