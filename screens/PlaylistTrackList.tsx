import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { useMusic, YtmsTrack, reorderAlbum, YtmsAlbum, YtmsPlaylist, reorderPlaylist } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import Icon from 'react-native-vector-icons/FontAwesome5';

const PlaylistTrackList = ({ route, navigation }: PlaylistTrackListProperties) => {
    const [{ tracks, albums, playlists }, saveChanges] = useMusic();
    const album = albums.find(a => a.albumId === route.params.albumId);
    const playlist = playlists.find(p => p.playlistId === route.params.playlistId)!;
    
    const filter: (track: YtmsTrack) => boolean =
        route.params.artistId ? t => t.artistId === route.params.artistId :
        t => true;
    
    const getTracks = () =>
        album ? album.tracks.map(trackId => tracks.find(t => t.trackId === trackId)!) :
        tracks.filter(filter);

    const addTrack = (track: YtmsTrack) => {
        playlist.tracks.push(track.trackId);
        saveChanges();
        ToastAndroid.show(`Added '${track.name}'`, ToastAndroid.SHORT);
    };

    return (
        <ScrollView style={styles.container}>
            {getTracks().map((track, i) => (
                <TouchableOpacity key={i} style={styles.item} onPress={() => addTrack(track)}>
                    <Text style={styles.itemText}>{track.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#336',
        padding: 10,
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    itemText: {
        color: '#fff',
        fontSize: 24,
    },
    reorderContainer: {
        height: '100%',
        // width: 50,
        // backgroundColor: 'white',
    },
    reorderBtn: {
        width: 50,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectTrackBtn: {
        flexShrink: 1,
    },
});

interface PlaylistTrackListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'TrackList'>;
    route: RouteProp<YtmsNavigationParamList, 'TrackList'>;
}

export default PlaylistTrackList;