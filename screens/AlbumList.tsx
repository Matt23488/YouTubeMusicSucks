import React, { useLayoutEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, ScrollView, Text, TouchableOpacity, Image, View } from 'react-native';
import { useMusic, YtmsAlbum } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const AlbumList = ({ route, navigation }: AlbumListProperties) => {
    const [{ albums }] = useMusic();

    const filter: (a: YtmsAlbum) => boolean = route.params.artistId === 'all' ? a => true : a => a.artistId === route.params.artistId;
    albums.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

    return (
        <ScrollView style={styles.container}>
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

const AlbumItem = (props: AlbumItemProperties) => {
    return (
        <TouchableOpacity onPress={props.onPress} onLongPress={props.onLongPress} style={styles.albumItem}>
            <Image style={styles.artwork} source={{ uri: props.album.artworkUrl }} />
            <View style={styles.albumItemInfo}>
                <Text style={[styles.text, { fontSize: 24, }]}>{props.album.name}</Text>
            </View>
        </TouchableOpacity>
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
    albumItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
    },
    artwork: {
        width: 100,
        height: 100,
        backgroundColor: 'black',
    },
    albumItemInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        overflow: 'hidden',
    },
    text: {
        color: 'white',
    },
});

interface AlbumListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'AlbumList'>;
    route: RouteProp<YtmsNavigationParamList, 'AlbumList'>;
}

interface AlbumItemProperties {
    album: YtmsAlbum;
    onPress?: () => void;
    onLongPress?: () => void;
}

export default AlbumList;