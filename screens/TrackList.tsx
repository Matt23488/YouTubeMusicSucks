import React, { useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { useMusic, YtmsTrack, reorderAlbum, YtmsAlbum, YtmsPlaylist, reorderPlaylist, YtmsArtist } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ToastAndroid } from 'react-native';

const TrackList = ({ route, navigation }: TrackListProperties) => {
    const [{ albums, playlists, artists }, saveChanges] = useMusic();
    const album = albums.find(a => a.albumId === route.params.albumId);
    const artist = artists.find(a => a.artistId === route.params.artistId);
    const playlist = playlists.find(p => p.playlistId === route.params.playlistId);

    useLayoutEffect(() => {
        let navParams: [keyof YtmsNavigationParamList, YtmsNavigationParamList[keyof YtmsNavigationParamList]] | undefined;

        if (route.params.albumId) navParams = ['AlbumEditor', { albumId: route.params.albumId }];
        else if (route.params.playlistId) navParams = ['PlaylistEditor', { playlistId: route.params.playlistId }];

        if (navParams) navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate(...navParams!)} style={{ marginRight: 16 }}>
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

    const editTrack = (tracks: YtmsTrack[], index: number) => {
        navigation.navigate('TrackEditor', { trackId: tracks[index].trackId });
    };

    const removeFromPlaylist = (tracks: YtmsTrack[], index: number) => {
        if (!playlist) return;

        playlist.tracks.splice(index, 1);
        saveChanges();
        ToastAndroid.show(`Removed '${tracks[index].name}'`, ToastAndroid.SHORT);
    };

    return (
        <ScrollView style={styles.container}>
            {album ?
                <AlbumTrackList album={album} onTrackPressed={playTrack} onTrackLongPressed={editTrack} /> : artist ?
                <ArtistTrackList artist={artist} onTrackPressed={playTrack} onTrackLongPressed={editTrack} /> : playlist ?
                <PlaylistTrackList playlist={playlist} onTrackPressed={playTrack} onTrackLongPressed={removeFromPlaylist} onAddTracks={() => navigation.navigate('PlaylistAddTrack', { playlistId: playlist.playlistId })} /> :
                <AllTrackList onTrackPressed={playTrack} onTrackLongPressed={editTrack} />}
        </ScrollView>
    );
};

const AlbumTrackList = (props: AlbumTrackListProperties) => {
    const [{ tracks }] = useMusic();
    return (
        <>
            {props.album.tracks.map(trackId => tracks.find(t => t.trackId === trackId)!).map((track, i, tracks) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity style={styles.selectTrackBtn} onPress={() => props.onTrackPressed(tracks, i)} onLongPress={() => props.onTrackLongPressed(tracks, i)}>
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

const ArtistTrackList = (props: ArtistTrackListProperties) => {
    const [{ tracks }] = useMusic();
    return (
        <>
            {props.artist.tracks.map(trackId => tracks.find(t => t.trackId === trackId)!).map((track, i, tracks) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity style={styles.selectTrackBtn} onPress={() => props.onTrackPressed(tracks, i)} onLongPress={() => props.onTrackLongPressed(tracks, i)}>
                        <Text style={styles.itemText}>{track.name}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </>
    );
};

const PlaylistTrackList = (props: PlaylistTrackListProperties) => {
    const [{ tracks }] = useMusic();


    return (
        <>
            <View style={styles.item}>
                <TouchableOpacity style={styles.selectTrackBtn} onPress={props.onAddTracks}>
                    <Text style={styles.itemText}>Add Tracks</Text>
                </TouchableOpacity>
            </View>
            {props.playlist.tracks.map(trackId => tracks.find(t => t.trackId === trackId)!).map((track, i, tracks) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity style={styles.selectTrackBtn} onPress={() => props.onTrackPressed(tracks, i)} onLongPress={() => props.onTrackLongPressed(tracks, i)}>
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
    const [{ tracks }] = useMusic();
    return (
        <>
            {tracks.map((track, i) => (
                <View key={i} style={styles.item}>
                    <TouchableOpacity onPress={() => props.onTrackPressed(tracks, i)} onLongPress={() => props.onTrackLongPressed(tracks, i)}>
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

interface CommonListProperties {
    onTrackPressed: (tracks: YtmsTrack[], i: number) => void;
    onTrackLongPressed: (tracks: YtmsTrack[], i: number) => void;
}

interface AlbumTrackListProperties extends CommonListProperties {
    album: YtmsAlbum;
}

interface ArtistTrackListProperties extends CommonListProperties {
    artist: YtmsArtist;
}

interface PlaylistTrackListProperties extends CommonListProperties {
    playlist: YtmsPlaylist;
    onAddTracks: () => void;
}

interface AllTrackListProperties extends CommonListProperties {
}

export default TrackList;