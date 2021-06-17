import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { YtmsAlbum } from '../utilities/storage';

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

interface AlbumItemProperties {
    album: YtmsAlbum;
    onPress?: () => void;
    onLongPress?: () => void;
}

export default AlbumItem;