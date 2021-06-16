import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useMusic } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const ArtistList = ({ route, navigation }: ArtistListProperties) => {
    const [{ artists }] = useMusic();

    artists.sort((a, b) => a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : 0);

    return (
        <ScrollView style={styles.container}>
            {artists.map(artist => (
                <TouchableOpacity
                    key={artist.artistId}
                    style={styles.item}
                    onPress={() => navigation.navigate('AlbumList', { artistId: artist.artistId })}
                    onLongPress={() => navigation.navigate('ArtistEditor', { artistId: artist.artistId })}
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

interface ArtistListProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'ArtistList'>;
    route: RouteProp<YtmsNavigationParamList, 'ArtistList'>;
}

export default ArtistList;