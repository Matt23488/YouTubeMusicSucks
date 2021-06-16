import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { useMusic, YtmsTrack, reorderAlbum, YtmsAlbum, YtmsPlaylist, reorderPlaylist } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import Icon from 'react-native-vector-icons/FontAwesome5';

const TrackList = ({ route, navigation }: TrackListProperties) => {
    const { tracks, albums, playlists } = useMusic();
    const album = albums.find(a => a.albumId === route.params.albumId);
    const playlist = playlists.find(p => p.playlistId === route.params.playlistId);

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
            {album ?
                <AlbumTrackList album={album} onTrackPressed={playTrack} /> : playlist ?
                <PlaylistTrackList playlist={playlist} onTrackPressed={playTrack} /> :
                <AllTrackList onTrackPressed={i => playTrack(tracks, i)} />}
        </ScrollView>
    );
};

const AlbumTrackList = (props: AlbumTrackListProperties) => {
    const { tracks } = useMusic();
    return (
        <>
            {props.album.tracks.map(trackId => tracks.find(t => t.trackId === trackId)!).map((track, i, tracks) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity style={styles.selectTrackBtn} onPress={() => props.onTrackPressed(tracks, i)}>
                        <Text style={styles.itemText}>{track.name}</Text>
                    </TouchableOpacity>
                    <View style={styles.reorderContainer}>
                        <TouchableOpacity style={styles.reorderBtn} onPress={() => i > 0 && reorderAlbum(props.album.albumId, i, i - 1)}>
                            <Icon name="sort-up" size={16} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.reorderBtn} onPress={() => i < props.album.tracks.length - 1 && reorderAlbum(props.album.albumId, i, i + 1)}>
                            <Icon name="sort-down" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </>
    );
};

const PlaylistTrackList = (props: PlaylistTrackListProperties) => {
    const { tracks } = useMusic();
    return (
        <>
            {props.playlist.tracks.map(trackId => tracks.find(t => t.trackId === trackId)!).map((track, i, tracks) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity style={styles.selectTrackBtn} onPress={() => props.onTrackPressed(tracks, i)}>
                        <Text style={styles.itemText}>{track.name}</Text>
                    </TouchableOpacity>
                    <View style={styles.reorderContainer}>
                        <TouchableOpacity style={styles.reorderBtn} onPress={() => i > 0 && reorderPlaylist(props.playlist.playlistId, i, i - 1)}>
                            <Icon name="sort-up" size={16} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.reorderBtn} onPress={() => i < props.playlist.tracks.length - 1 && reorderPlaylist(props.playlist.playlistId, i, i + 1)}>
                            <Icon name="sort-down" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </>
    );
};

const AllTrackList = (props: AllTrackListProperties) => {
    const { tracks } = useMusic();
    return (
        <>
            {tracks.map((track, i) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity onPress={() => props.onTrackPressed(i)}>
                        <Text style={styles.itemText}>{track.name}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </>
    );
}

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

interface TrackListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'TrackList'>;
    route: RouteProp<YtmsNavigationParamList, 'TrackList'>;
}

interface AlbumTrackListProperties {
    album: YtmsAlbum;
    onTrackPressed: (tracks: YtmsTrack[], i: number) => void;
}

interface PlaylistTrackListProperties {
    playlist: YtmsPlaylist;
    onTrackPressed: (tracks: YtmsTrack[], i: number) => void;
}

interface AllTrackListProperties {
    onTrackPressed: (i: number) => void;
}

export default TrackList;