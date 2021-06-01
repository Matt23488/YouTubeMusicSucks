import React from 'react';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = 'ytms.context.MusicStore';
export const useMusicStore = () => {
    const [music, setMusic] = React.useState([[], [], []]);

    React.useEffect(async () => {
        const serializedMusic = await AsyncStorage.getItem(storageKey);
        if (serializedMusic) setMusic(JSON.parse(serializedMusic));
    });

    const saveMusic = async ([artists, albums, songs]) => {
        await AsyncStorage.setItem(storageKey, JSON.stringify([artists, albums, songs]));
        setMusic([artists, albums, songs]);
    };

    const refreshMusic = () => {
        const getArtists = RNAndroidAudioStore.getArtists();
        const getAlbums = RNAndroidAudioStore.getAlbums();
        const getSongs = RNAndroidAudioStore.getSongs();

        Promise.all([getArtists, getAlbums, getSongs]).then(saveMusic);
    };

    return [music, refreshMusic];
};