import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import uuid from 'react-native-uuid';

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
/** @type {Array<(data: YtmsData) => void>} */
let storedDataChangedCallbacks = [];

/** @type {(callback: (data: YtmsData) => void) => void} */
const onStoredDataChanged = callback => { storedDataChangedCallbacks.push(callback); };

/** @type {(callback: (data: YtmsData) => void) => void} */
const offStoredDataChanged = callback => { storedDataChangedCallbacks = storedDataChangedCallbacks.filter(c => c !== callback); };

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
        dispatchMusicChanged();
    }
});

const saveData = async () => {
    await AsyncStorage.setItem(storageKey, JSON.stringify(storedData));
};

const dispatchMusicChanged = () => {
    const updatedData = Object.assign({}, storedData);
    storedDataChangedCallbacks.forEach(c => c(updatedData));
};

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
 * @property {string} name
 * @property {string} spotifyID
 * @property {string} albumID
 * @property {string} artistID
 * @property {string} albumName
 * @property {string} artistName
 * @property {string} filePath
 * @property {number} duration
 */

/**
 * @typedef {Object} YtmsAlbum
 * @property {string} albumID
 * @property {string} spotifyID
 * @property {string} name
 * @property {string} artistID
 * @property {string} artistName
 * @property {string[]} tracks
 * @property {string} artworkURL
 */

/**
 * @typedef {Object} YtmsArtist
 * @property {string} artistID
 * @property {string} spotifyID
 * @property {string} name
 * @property {string[]} albums
 * @property {string[]} tracks
 */

/**
 * @typedef {Object} YtmsPlaylist
 * @property {string} playlistID
 * @property {string[]} tracks
 */

/** @type {(predicate: (track: YtmsTrack, index: number, tracks: YtmsTrack[]) => boolean) => YtmsTrack[]} */
export const useTracks = (predicate = () => true) => {
    const [tracks, setTracks] = useState(storedData.tracks);
    useEffect(() => {
        setTracks(storedData.tracks.filter(predicate));
    }, [storedData.tracks]);

    return tracks;
};


export const useMusic = () => {
    const [data, setData] = useState(storedData);

    useEffect(() => {
        onStoredDataChanged(setData);

        return () => offStoredDataChanged(setData);
    }, []);

    return data;
};

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

export const importSongs = async () => {
    const allSongs = await RNAndroidAudioStore.getSongs();
    const storedIds = storedData.tracks.map(s => s.trackID);
    const newSongs = allSongs.filter(s => !storedIds.includes(s.id));

    console.log('new songs:', newSongs.length);
    if (newSongs.length === 0) return;

    /** @typedef {import('@yajanarao/react-native-get-music-files').Song} Song */
    /** @typedef {import('@yajanarao/react-native-get-music-files').Album} Album */

    /** @type {Record<string, { id: string, songs: Song[], albums: Record<string, { id: string, songs: Song[] }> }} */
    const artistObj = groupIntoObject(newSongs, s => s.artist.toLowerCase().trim(), s => ({ id: uuid.v4(), songs: [s] }), (s, g) => g.songs.push(s));
    Object.entries(artistObj).forEach(([artistName, artistData]) => {
        artistData.albums = groupIntoObject(artistData.songs, s => s.album.toLowerCase().trim(), s => ({ id: uuid.v4(), songs: [s] }), (s, g) => g.songs.push(s));
    });
    // console.log('artistObj', artistObj);

    /** @type {YtmsTrack[]} */
    const newTracks = [];

    /** @type {YtmsAlbum[]} */
    const albumsWithNewSongs = [];

    /** @type {YtmsArtist[]} */
    const artistsWithNewSongs = Object.entries(artistObj).map(([artistName, artistData]) => {
        albumsWithNewSongs.push(...Object.entries(artistData.albums).map(([albumName, albumData]) => {
            newTracks.push(...albumData.songs.map(s => {
                /** @type {YtmsTrack} */
                const track = {
                    trackID: s.id,
                    name: s.title,
                    artistID: artistData.id,
                    artistName,
                    albumID: albumData.id,
                    albumName,
                    filePath: s.path,
                    spotifyID: null,
                    duration: Number(s.duration) / 1000,
                };

                return track;
            }));

            /** @type {YtmsAlbum} */
            const album = {
                albumID: albumData.id,
                name: albumName,
                artistID: artistData.id,
                artistName,
                artworkURL: null,
                spotifyID: null,
                tracks: albumData.songs.map(s => s.id),
            };

            return album;
        }))

        return {
            artistID: artistData.id,
            name: artistName,
            spotifyID: null,
            albums: Object.entries(artistData.albums).map(([name, data]) => data.id),
            songs: artistData.songs.map(s => s.id),
        };
    });
    
    artistsWithNewSongs.forEach(artist => {
        const existingArtist = storedData.artists.find(a => a.name.toLowerCase() === artist.name);
        if (!existingArtist) storedData.artists.push(artist);
        else existingArtist.tracks.push(...artist.tracks);
        
    });
    
    albumsWithNewSongs.forEach(album => {
        const existingAlbum = storedData.albums.find(a => a.artistName.toLowerCase() === album.artistName && a.name.toLowerCase() === album.name)
        if (!existingAlbum) storedData.albums.push(album);
        else existingAlbum.tracks.push(...album.tracks);
    });
    
    storedData.tracks.push(...newTracks);
    await saveData();
    dispatchMusicChanged();
};

/**
 * @template T, G
 * @param {T[]} arr 
 * @param {(item: T) => string} accessor 
 * @param {(item: T) => G} create
 * @param {(item: T, group: G) => void} update
 */
const groupIntoObject = (arr, accessor, create, update) => {
    return arr.reduce((/** @type {Record<string, G>} */map, item) => {
        const key = accessor(item);
        if (map[key]) update(item, map[key]);
        else map[key] = create(item);
        return map;
    }, {});
};