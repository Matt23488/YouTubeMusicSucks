import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import { importSongs, useMusic, YtmsAlbum, YtmsArtist, YtmsTrack } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const HomeScreen = (props: { navigation: StackNavigationProp<YtmsNavigationParamList, 'HomeScreen'> }) => {
    const { navigation } = props;
    const { tracks, albums, artists } = useMusic();

    artists.sort(({ name: aName }, { name: bName }) => aName < bName ? -1 : aName > bName ? 1 : 0);
    albums.sort(({ name: aName }, { name: bName }) => aName < bName ? -1 : aName > bName ? 1 : 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ flex: 1 }}>Artists found: {artists.length}</Text>
                <Text style={{ flex: 1 }}>Albums found: {albums.length}</Text>
                <Text style={{ flex: 1 }}>Tracks found: {tracks.length}</Text>
            </View>
            <View style={styles.main}>
                <TouchableOpacity style={styles.navItem} onPress={importSongs}>
                    <Text>Import New Music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ArtistList')}>
                    <Text>Artists</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AlbumList', { artistId: 'all' })}>
                    <Text>Albums</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TrackList', { artistId: 'all' })}>
                    <Text>Tracks</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  header: {
    flex: 1,
  },

  main: {
    flex: 5,
    // borderWidth: 1,
    // borderColor: 'black',
    width: '100%',
  },

  navItem: {
    height: 100,
    borderWidth: 1,
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textInput: {
    backgroundColor: '#000',
  },
});

export default HomeScreen;