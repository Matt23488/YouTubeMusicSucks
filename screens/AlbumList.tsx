import React, { useLayoutEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMusic, YtmsAlbum } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const AlbumList = ({ route, navigation }: AlbumListProperties) => {
    const [{ albums }] = useMusic();

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight:
    //     })
    // }, [navigation]);

    const filter: (a: YtmsAlbum) => boolean = route.params.artistId === 'all' ? a => true : a => a.artistId === route.params.artistId;
    albums.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

    return (
        <ScrollView style={styles.container}>
            {albums.filter(filter).map(album => (
                <TouchableOpacity key={album.albumId} style={styles.item} onPress={() => navigation.navigate('TrackList', { artistId: album.artistId, albumId: album.albumId })}>
                    <Text style={styles.itemText}>{album.name}</Text>
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

interface AlbumListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'AlbumList'>;
    route: RouteProp<YtmsNavigationParamList, 'AlbumList'>;
}

export default AlbumList;