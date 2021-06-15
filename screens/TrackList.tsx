import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { useMusic, YtmsTrack } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const TrackList = (props: AlbumListProperties) => {
    const { tracks, albums } = useMusic();

    const filter: (t: YtmsTrack) => boolean =
        props.route.params.albumId ?
            t => t.albumId === props.route.params.albumId :
            props.route.params.artistId === 'all' ?
                t => true :
                t => t.artistId === props.route.params.artistId;

    const playTrack = async (tracks: YtmsTrack[], index: number) => {
        await TrackPlayer.reset();
        await TrackPlayer.add(tracks.map(track => ({
            id: track.trackId,
            url: `file://${track.filePath}`,
            title: track.name,
            artist: track.artistName,
            artwork: albums.find(a => a.albumId === track.albumId)?.artworkUrl,
            duration: track.duration,
            album: track.albumName
        })));
        await TrackPlayer.skip(index);

        TrackPlayer.play();
    };

    return (
        <ScrollView>
            {tracks.filter(filter).map((track, i, tracks) => (
                <TouchableOpacity key={track.trackId} style={styles.item} onPress={() => playTrack(tracks, i)}>
                    <Text>{track.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    item: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

interface AlbumListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'TrackList'>;
    route: RouteProp<YtmsNavigationParamList, 'TrackList'>;
}

export default TrackList;