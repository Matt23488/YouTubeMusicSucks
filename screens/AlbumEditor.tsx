import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, ScrollView, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import * as spotify from '../utilities/spotify';
import type { SpotifyAlbum, SpotifyAlbumDetail } from '../utilities/spotify';
import { useMusic } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import Fontisto from 'react-native-vector-icons/Fontisto';

const AlbumEditor = ({ navigation, route }: AlbumEditorProperties) => {
    const [{ albums }, saveChanges] = useMusic();
    const album = albums.find(a => a.albumId === route.params.albumId)!;

    const [tempName, setTempName] = useState(album.name);
    const [spotifySearchVal, setSpotifySearchVal] = useState(tempName);
    const [spotifyResults, setSpotifyResults] = useState<SpotifyAlbum[]>([]);
    const [spotifySelection, setSpotifySelection] = useState<SpotifyAlbum>();
    
    const [timeoutHandle, setTimeoutHandle] = useState<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        spotify.search({ q: spotifySearchVal, types: ['album'] }).then(response => {
            setSpotifyResults(response.albums?.items ?? []);
        });
    }, [spotifySearchVal]);

    useEffect(() => {
        if (!album.spotifyId) setSpotifySelection(undefined);
        else spotify.getAlbum({ album: album.spotifyId }).then(setSpotifySelection);
    }, [album.spotifyId]);

    const onChangeTempName = (newName: string) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        const handle = setTimeout(() => {
            setSpotifySearchVal(tempName);
            setTimeoutHandle(undefined);
        }, 2000);
        setTimeoutHandle(handle);
        setTempName(newName);
    };

    const saveAlbum = () => {
        album.name = tempName;
        album.spotifyId = spotifySelection?.id;
        album.artworkUrl = spotifySelection?.images?.[0]?.url;
        saveChanges();
        navigation.pop();
    };

    return (
        <View style={styles.container}>
            <TextInput style={{ borderBottomWidth: 1, fontSize: 24, color: 'white', borderColor: 'white', }} defaultValue={tempName} onChangeText={onChangeTempName} />
            <View style={{ flexGrow: 1, flexShrink: 1, borderWidth: 1, borderColor: 'white', padding: 10, marginTop: 10, }}>
                <Text style={{ color: 'white', fontSize: 24, textAlign: 'center' }}>Artwork Search</Text>
                <ScrollView style={{ flexGrow: 1, }}>
                    <SpotifyResult selected={!spotifySelection} onPressed={setSpotifySelection} />
                    {spotifySelection && <SpotifyResult album={spotifySelection} selected={true} />}
                    {spotifyResults.filter(a => a.id !== spotifySelection?.id).map((a, i) => (
                        <SpotifyResult key={i} selected={false} album={a} onPressed={setSpotifySelection} />
                    ))}
                </ScrollView>
            </View>
            <TouchableOpacity onPress={saveAlbum} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#9f00ff', padding: 10, }}><Text style={{ fontSize: 24, color: 'white' }}>Save</Text></TouchableOpacity>
        </View>
    );
};

const SpotifyResult = (props: SpotifyResultProperties) => {
    return (
        <TouchableOpacity onPress={() => props.onPressed?.(props.album)} style={{ flexDirection: 'row', alignItems: 'center', height: 100, }}>
            <Image style={{ width: 100, height: 100, backgroundColor: 'black' }} source={{ uri: props.album?.images?.[0]?.url }} />
            <View style={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1, flexShrink: 1, overflow: 'hidden' }}>
                {props.album ?
                <View>
                    <Text style={{ color: 'white', fontSize: 16, }}>{props.album.name}</Text>
                    {props.album.artists.map((a, i) => <Text key={i} style={{ color: 'white', }}>{a.name}</Text>)}
                </View> :
                <Text style={{ color: 'white', fontSize: 24, }}>None</Text>}
            </View>
            <Fontisto name={props.selected ? 'radio-btn-active' : 'radio-btn-passive'} size={24} color="white" style={{ marginRight: 10, }} />
        </TouchableOpacity>
    );
};

interface AlbumEditorProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'AlbumEditor'>;
    route: RouteProp<YtmsNavigationParamList, 'AlbumEditor'>;
}

interface SpotifyResultProperties {
    album?: SpotifyAlbum;
    onPressed?: (album: SpotifyAlbum | undefined) => void;
    selected: boolean;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#336',
        padding: 10,
        height: '100%',
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