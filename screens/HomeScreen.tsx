import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { importSongs, useMusic, YtmsAlbum, YtmsArtist, YtmsTrack } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const HomeScreen = (props: { navigation: StackNavigationProp<YtmsNavigationParamList, 'HomeScreen'> }) => {
    const { navigation } = props;
    const { tracks, albums, artists } = useMusic();

    artists.sort(({ name: aName }, { name: bName }) => aName < bName ? -1 : aName > bName ? 1 : 0);
    albums.sort(({ name: aName }, { name: bName }) => aName < bName ? -1 : aName > bName ? 1 : 0);

    return (
        <View style={styles.container}>
            {/* <View style={styles.header}>
                <Text style={{ flex: 1, color: 'white' }}>Artists found: {artists.length}</Text>
                <Text style={{ flex: 1, color: 'white' }}>Albums found: {albums.length}</Text>
                <Text style={{ flex: 1, color: 'white' }}>Tracks found: {tracks.length}</Text>
            </View> */}
            <View style={styles.main}>
                <TouchableOpacity style={styles.navItem} onPress={importSongs}>
                    <Icon name="file-import" size={24} color="white" />
                    <Text style={styles.actionText}>Import New Music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ArtistList')}>
                    <Icon name="user" size={24} color="white" />
                    <Text style={styles.actionText}>Artists</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AlbumList', { artistId: 'all' })}>
                    <Icon name="compact-disc" size={24} color="white" />
                    <Text style={styles.actionText}>Albums</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TrackList', { artistId: 'all' })}>
                    <Icon name="music" size={24} color="white" />
                    <Text style={styles.actionText}>Tracks</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#336',
    padding: 10,
  },

  header: {
    flex: 1,
  },

  main: {
    flex: 5,
    width: '100%',
  },

  navItem: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  
  actionText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 24,
  },
});

export default HomeScreen;