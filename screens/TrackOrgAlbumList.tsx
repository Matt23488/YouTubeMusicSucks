import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import prompt from 'react-native-prompt-android';
import AlbumItem from '../components/AlbumItem';
import { useMusic, YtmsAlbum } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import uuid from 'react-native-uuid';

const TrackOrgAlbumList = ({ route, navigation }: TrackOrgAlbumListProperties) => {
    const [{ albums, artists, tracks }, saveChanges] = useMusic();
    const track = tracks.find(t => t.trackId === route.params.trackId)!;
    const oldArtist = artists.find(a => a.artistId === track.artistId)!;
    const oldAlbum = albums.find(a => a.albumId === track.albumId)!;

    const newArtist = artists.find(a => a.artistId === route.params.artistId)!;

    const currentAlbum = albums.find(a => a.albumId === route.params.albumId);
    const otherAlbums = albums.filter(a => a !== currentAlbum && a.artistId === route.params.artistId).sort((a, b) => a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : 0);

    const newAlbum = () => {
        prompt('New Artist', 'What is the Artist\'s name?', name => {
            const newAlbum = {
                albumId: uuid.v4(),
                name,
                artistName: newArtist.name,
                artistId: newArtist.artistId,
                tracks: [],
            } as YtmsAlbum;

            newArtist.albums.push(newAlbum.albumId);
            albums.push(newAlbum);
            saveTrack(newAlbum);
        });
    };

    const deleteAlbum = (album: YtmsAlbum) => {
        if (album.tracks.length > 0) return;

        const index = albums.findIndex(a => a.albumId === album.albumId);
        albums.splice(index, 1);

        saveChanges();
    };

    const saveTrack = (album: YtmsAlbum) => {
        // Update album track lists
        oldAlbum.tracks = oldAlbum.tracks.filter(t => t !== track.trackId);
        album.tracks.push(track.trackId);

        // Update artist track lists
        if (route.params.artistId !== track.artistId) {
            oldArtist.tracks = oldArtist.tracks.filter(t => t !== track.trackId);
            newArtist.tracks.push(track.trackId);
        }

        // Update track data
        track.artistId = route.params.artistId;
        track.albumId = album.albumId;
        track.artistName = newArtist.name;
        track.albumName = album.name;

        saveChanges();

        navigation.pop(2);
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.item}
                onPress={newAlbum}
            >
                <Text style={styles.itemText}>New Album</Text>
            </TouchableOpacity>
            {currentAlbum && <AlbumItem
                album={currentAlbum}
                onPress={() => navigation.pop(2)} // This is just selecting the same album it's already in, so do nothing.
            />}
            {otherAlbums.map(album => (
                <AlbumItem
                    key={album.albumId}
                    album={album}
                    onPress={() => saveTrack(album)}
                    onLongPress={() => deleteAlbum(album)}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#336',
        // padding: 10,
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

interface TrackOrgAlbumListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'TrackOrgAlbumList'>;
    route: RouteProp<YtmsNavigationParamList, 'TrackOrgAlbumList'>;
}

export default TrackOrgAlbumList;