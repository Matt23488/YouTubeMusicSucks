import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMusic } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const ArtistList = (props: AlbumListProperties) => {
    const { artists } = useMusic();

    return (
        <ScrollView>
            {artists.map(artist => (
                <TouchableOpacity key={artist.artistId} style={styles.item} onPress={() => props.navigation.navigate('AlbumList', { artistId: artist.artistId })}>
                    <Text>{artist.name}</Text>
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
    navigation: StackNavigationProp<YtmsNavigationParamList, 'ArtistList'>;
    route: RouteProp<YtmsNavigationParamList, 'ArtistList'>;
}

export default ArtistList;