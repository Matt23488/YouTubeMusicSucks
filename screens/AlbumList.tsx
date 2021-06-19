import React, { useLayoutEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, ScrollView, Text, TouchableOpacity, Image, View } from 'react-native';
import { useMusic, YtmsAlbum } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';
import AlbumItem from '../components/AlbumItem';

const AlbumList = ({ route, navigation }: AlbumListProperties) => {
    const [{ albums }] = useMusic();

    const filter: (a: YtmsAlbum) => boolean = route.params.artistId === 'all' ? a => true : a => a.artistId === route.params.artistId;
    albums.sort((a, b) => a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : 0);

    return (
        <ScrollView style={styles.container}>
            {route.params.artistId !== 'all' &&
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('TrackList', { artistId: route.params.artistId })}>
                <Text style={styles.itemText}>All Tracks</Text>
            </TouchableOpacity>}
            {albums.filter(filter).map(album => (
                <AlbumItem
                    key={album.albumId}
                    album={album}
                    onPress={() => navigation.navigate('TrackList', { artistId: album.artistId, albumId: album.albumId })}
                    onLongPress={() => navigation.navigate('AlbumEditor', { albumId: album.albumId })}
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

interface AlbumListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'AlbumList'>;
    route: RouteProp<YtmsNavigationParamList, 'AlbumList'>;
}

export default AlbumList;