import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { useMusic, YtmsTrack, reorderAlbum, YtmsAlbum, YtmsPlaylist, reorderPlaylist } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import Icon from 'react-native-vector-icons/FontAwesome5';
import prompt from 'react-native-prompt-android';
import uuid from 'react-native-uuid';

const PlaylistList = ({ navigation }: PlaylistListProperties) => {
    const [{ playlists }, saveChanges] = useMusic();
    
    const newPlaylist = () => {
        prompt('New Playlist', 'What is the Playlist\'s name?', name => {
            const newPlaylist = {
                playlistId: uuid.v4(),
                name,
                tracks: [],
            } as YtmsPlaylist;

            playlists.push(newPlaylist);
            saveChanges();
            navigation.navigate('TrackList', { playlistId: newPlaylist.playlistId });
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.item}>
                <TouchableOpacity onPress={newPlaylist}>
                    <Text style={styles.itemText}>Create New Playlist</Text>
                </TouchableOpacity>
            </View>
            {playlists.map((playlist, i) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity onPress={() => navigation.navigate('TrackList', { playlistId: playlist.playlistId })} onLongPress={() => navigation.navigate('PlaylistEditor', { playlistId: playlist.playlistId })}>
                        <Text style={styles.itemText}>{playlist.name}</Text>
                    </TouchableOpacity>
                </View>
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

interface PlaylistListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'PlaylistList'>;
}

export default PlaylistList;