import React, { useLayoutEffect } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { useMusic, YtmsTrack } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import Icon from 'react-native-vector-icons/FontAwesome5';

const TrackList = ({ route, navigation }: TrackListProperties) => {
    const { tracks, albums } = useMusic();

    useLayoutEffect(() => {
        if (!route.params.albumId) return;

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('AlbumEditor', { albumId: route.params.albumId! })} style={{ marginRight: 16 }}>
                    <Icon name="cog" color="#fff" size={24} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const filter: (t: YtmsTrack) => boolean =
        route.params.albumId ?
            t => t.albumId === route.params.albumId :
            route.params.artistId === 'all' ?
                t => true :
                t => t.artistId === route.params.artistId;

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
        <ScrollView style={styles.container}>
            {tracks.filter(filter).map((track, i, tracks) => (
                <TouchableOpacity key={track.trackId} style={styles.item} onPress={() => playTrack(tracks, i)}>
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
        // borderColor: '#ccc',
        // borderWidth: 1,
        // padding: 20,
        // justifyContent: 'center',
        // alignItems: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    itemText: {
        color: '#fff',
        fontSize: 24,
    },
});

interface TrackListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'TrackList'>;
    route: RouteProp<YtmsNavigationParamList, 'TrackList'>;
}

export default TrackList;