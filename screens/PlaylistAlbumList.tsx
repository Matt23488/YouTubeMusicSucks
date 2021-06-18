import React, { useLayoutEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, ScrollView, Text, TouchableOpacity, Image, View } from 'react-native';
import { useMusic, YtmsAlbum } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import AlbumItem from '../components/AlbumItem';

const PlaylistAlbumList = ({ route, navigation }: PlaylistAlbumListProperties) => {
    const [{ albums }] = useMusic();
    albums.sort((a, b) => a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : 0);

    const filter: (a: YtmsAlbum) => boolean = route.params.artistId ? a => a.artistId === route.params.artistId : a => true;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('PlaylistTrackList', { playlistId: route.params.playlistId, artistId: route.params.artistId })}>
                <Text style={styles.itemText}>All Tracks</Text>
            </TouchableOpacity>
            {albums.filter(filter).map(album => (
                <AlbumItem
                    key={album.albumId}
                    album={album}
                    onPress={() => navigation.navigate('PlaylistTrackList', { playlistId: route.params.playlistId, artistId: album.artistId, albumId: album.albumId })}
                />
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

interface PlaylistAlbumListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'PlaylistAlbumList'>;
    route: RouteProp<YtmsNavigationParamList, 'PlaylistAlbumList'>;
}

export default PlaylistAlbumList;