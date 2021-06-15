import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import { groupIntoObject } from './assorted';

const storageKey = 'ytmsStorageKey';
const storedData = { tracks: [], albums: [], artists: [], playlists: [] } as YtmsData;

const onMusicUpdatedCallbacks = new Map<string, (data: YtmsData) => void>();

const onMusicUpdated = (callback: (data: YtmsData) => void) => {
    const id = uuid.v4() as string;
    onMusicUpdatedCallbacks.set(id, callback);
    return {
        remove: () => onMusicUpdatedCallbacks.delete(id),
    } as { remove: () => void };
};

const dispatchMusicUpdated = (copy?: YtmsData) => {
    const dispatchVal = copy ?? Object.assign({}, storedData);
    [...onMusicUpdatedCallbacks.values()].forEach(callback => callback(dispatchVal));
};

AsyncStorage.getItem(storageKey, (err, res) => {
    if (err) return console.error(err);
    if (!res) return;

    const parsed = JSON.parse(res) as YtmsData;
    Object.assign(storedData, parsed);
    dispatchMusicUpdated(parsed);
});

const saveData = () => AsyncStorage.setItem(storageKey, JSON.stringify(storedData));

export const useMusic = () => {
    const [data, setData] = useState(storedData);

    useEffect(() => {
        const handle = onMusicUpdated(setData);
        return handle.remove;
    }, []);

    return data;
};

export const importSongs = async () => {
    const allFsTracks = await RNAndroidAudioStore.getSongs();
    const storedIds = storedData.tracks.map(s => s.trackId);
    const newTracks = allFsTracks.filter(s => !storedIds.includes(s.id));

    console.log(`found ${newTracks.length} new tracks`);
    if (newTracks.length === 0) return;

    // TODO: Format this monstrosity
    const artistObj = groupIntoObject<typeof newTracks[0], { id: string, tracks: typeof newTracks, albums: Record<string, { id: string, tracks: typeof newTracks }>}>(newTracks, t => t.artist.toLocaleLowerCase().trim(), t => ({ id: uuid.v4() as string, tracks: [t], albums: {} }), (t, g) => g.tracks.push(t));
    Object.entries(artistObj).forEach(([artistName, artistData]) => {
        artistData.albums = groupIntoObject(artistData.tracks, t => t.album.toLocaleLowerCase().trim(), t => ({ id: uuid.v4() as string, tracks: [t] }), (t, g) => g.tracks.push(t));
    });

    const newYtmsTracks = [] as YtmsTrack[];
    const albumsWithNewTracks = [] as YtmsAlbum[];
    const artistsWithNewTracks = Object.entries(artistObj).map(([artistName, artistData]) => {
        albumsWithNewTracks.push(...Object.entries(artistData.albums).map(([albumName, albumData]) => {
            newYtmsTracks.push(...albumData.tracks.map(t => {
                return {
                    trackId: t.id,
                    name: t.title,
                    artistId: artistData.id,
                    artistName,
                    albumId: albumData.id,
                    albumName,
                    filePath: t.path,
                    duration: Number(t.duration) / 1000,
                };
            }));

            return {
                albumId: albumData.id,
                name: albumName,
                artistId: artistData.id,
                artistName,
                tracks: albumData.tracks.map(t => t.id),
            };
        }));

        return {
            artistId: artistData.id,
            name: artistName,
            albums: Object.entries(artistData.albums).map(([name, data]) => data.id),
            tracks: artistData.tracks.map(t => t.id),
        } as YtmsArtist;
    });

    artistsWithNewTracks.forEach(artist => {
        const existingArtist = storedData.artists.find(a => a.name.toLocaleLowerCase() === artist.name);
        if (!existingArtist) storedData.artists.push(artist);
        else existingArtist.tracks.push(...artist.tracks);
    });

    albumsWithNewTracks.forEach(album => {
        const existingAlbum = storedData.albums.find(a => a.artistName.toLocaleLowerCase() === album.artistName && a.name.toLocaleLowerCase() === album.name);
        if (!existingAlbum) storedData.albums.push(album);
        else existingAlbum.tracks.push(...album.tracks);
    });

    storedData.tracks.push(...newYtmsTracks);
    await saveData();
    dispatchMusicUpdated();
};

export interface YtmsData {
    tracks: YtmsTrack[];
    albums: YtmsAlbum[];
    artists: YtmsArtist[];
    playlists: YtmsPlaylist[];
}

export interface YtmsTrack {
    trackId: string;
    name: string;
    spotifyId?: string;
    albumId: string;
    artistId: string;
    albumName: string;
    artistName: string;
    filePath: string;
    duration: number;
}

export interface YtmsAlbum {
    albumId: string;
    spotifyId?: string;
    name: string;
    artistId: string;
    artistName: string;
    tracks: string[];
    artworkUrl?: string;
}

export interface YtmsArtist {
    artistId: string;
    spotifyId?: string;
    name: string;
    albums: string[];
    tracks: string[];
}

export interface YtmsPlaylist {
    playlistId: string;
    tracks: string[];
}