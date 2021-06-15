import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMusic, YtmsAlbum } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const AlbumList = (props: AlbumListProperties) => {
    const { albums } = useMusic();

    const filter: (a: YtmsAlbum) => boolean = props.route.params.artistId === 'all' ? a => true : a => a.artistId === props.route.params.artistId;

    return (
        <ScrollView>
            {albums.filter(filter).map(album => (
                <TouchableOpacity key={album.albumId} style={styles.item} onPress={() => props.navigation.navigate('TrackList', { artistId: album.artistId, albumId: album.albumId })}>
                    <Text>{album.name}</Text>
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
    navigation: StackNavigationProp<YtmsNavigationParamList, 'AlbumList'>;
    route: RouteProp<YtmsNavigationParamList, 'AlbumList'>;
}

export default AlbumList;