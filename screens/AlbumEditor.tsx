import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, ScrollView, TextInput, Image, Text } from 'react-native';
import * as spotify from '../utilities/spotify';
import type { SpotifyAlbum, SpotifyTrack, SpotifyPagedCollection } from '../utilities/spotify';
import { useMusic } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const AlbumEditor = ({ navigation, route }: AlbumEditorProperties) => {
    const { albums, tracks } = useMusic();
    const ytmsAlbum = albums.find(a => a.albumId === route.params.albumId)!;
    // console.log(ytmsAlbum);

    const [albumName, setAlbumName] = useState(ytmsAlbum.name);
    // const [spotifyId, setSpotifyId] = useState<string>();
    // const [artworkUrl, setArtworkUrl] = useState<string>();
    const [spotifyAlbum, setSpotifyAlbum] = useState<SpotifyAlbum>();
    const [spotifyTrackList, setSpotifyTrackList] = useState<SpotifyPagedCollection<SpotifyTrack>>();
    useEffect(() => {
        spotify.search({ q: albumName, types: ['album'] }).then(async ({ albums }) => {
            if (!albums) return;
            if (albums.items.length === 0) return;

            // const album = await spotify.getAlbumTrackList({ album: albums.items[0].href });
            // setSpotifyId(albums.items[0].id);
            // setArtworkUrl(albums.items[0].images[0]?.url);
            // console.log()
            const result = await spotify.getAlbumTrackList({ album: albums.items[0].href });
            setSpotifyTrackList(result.tracks);
            setSpotifyAlbum(albums.items[0]);
        });
    }, [albumName]);

    // useEffect(() => {
    //     // console.log('current id', spotifyId);
    //     // console.log('artwork', artworkUrl);
    //     // console.log(spotifyAlbum?.href);
    //     // console.log(spotifyTrackList);
    // }, [spotifyAlbum]);

    // TODO: if spotifyAlbum is undefined, display no results instead of the spotify results
    return (
        <View style={styles.container}>
            <Image style={styles.artwork} source={{ uri: spotifyAlbum?.images[0]?.url }} />
            <Text style={styles.text}>{spotifyAlbum?.name}</Text>
            <ScrollView style={{ flexDirection: 'row', flexGrow: 1 }}>
                <View style={{ flexGrow: 1 }}>
                    {spotifyTrackList?.items?.map(t => (
                        <Text style={[styles.text, styles.track]} key={t.id}>{t.track_number} - {t.name}</Text>
                    ))}
                </View>
                <View style={{ flexGrow: 1 }}>
                    {ytmsAlbum.tracks.map(trackId => tracks.find(t => t.trackId === trackId)!).map((t, i) => (
                        <Text style={[styles.text, styles.track]} key={i}>{i + 1} - {t.name}</Text>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

interface AlbumEditorProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'AlbumEditor'>;
    route: RouteProp<YtmsNavigationParamList, 'AlbumEditor'>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#336',
        padding: 10,
    },
    artwork: {
        width: 240,
        height: 240,
    },
    text: {
        color: '#fff',
    }, 
    track: {
        height: 30,
    },
});

export default AlbumEditor;