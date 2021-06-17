import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import prompt from 'react-native-prompt-android';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMusic, YtmsArtist } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import uuid from 'react-native-uuid';

const TrackOrgArtistList = ({ route, navigation }: TrackOrgArtistListProperties) => {
    const [{ artists, albums }, saveChanges] = useMusic();
    const currentArtist = artists.find(a => a.artistId === route.params.artistId)!;
    const otherArtists = artists.filter(a => a !== currentArtist).sort((a, b) => a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : 0);

    const newArtist = () => {
        prompt('New Artist', 'What is the Artist\'s name?', name => {
            const newArtist = {
                artistId: uuid.v4(),
                name,
                albums: [],
                tracks: [],
            } as YtmsArtist;

            artists.push(newArtist);
            saveChanges();
            navigation.navigate('TrackOrgAlbumList', { trackId: route.params.trackId, artistId: newArtist.artistId });
        });
    };

    const deleteArtist = (artist: YtmsArtist) => {
        if (artist.tracks.length > 0) return;

        artist.albums.forEach(albumId => {
            const index = albums.findIndex(a => a.albumId === albumId)!;
            albums.splice(index, 1);
        });

        const index = artists.findIndex(a => a.artistId === artist.artistId);
        artists.splice(index, 1);

        saveChanges();
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.item}
                onPress={newArtist}
            >
                <Text style={styles.itemText}>New Artist</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('TrackOrgAlbumList', route.params)}
            >
                <Text style={styles.itemText}>{currentArtist.name}</Text>
            </TouchableOpacity>
            {otherArtists.map(artist => (
                <TouchableOpacity
                    key={artist.artistId}
                    style={styles.item}
                    onPress={() => navigation.navigate('TrackOrgAlbumList', { trackId: route.params.trackId, artistId: artist.artistId })}
                    onLongPress={() => deleteArtist(artist)}
                >
                    <Text style={styles.itemText}>{artist.name}</Text>
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

interface TrackOrgArtistListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'TrackOrgArtistList'>;
    route: RouteProp<YtmsNavigationParamList, 'TrackOrgArtistList'>;
}

export default TrackOrgArtistList;