import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LogBox, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import Permissions from 'react-native-permissions';
import TrackPlayer from 'react-native-track-player';
import ActionList from './components/ActionList';
import { useMusicStore } from './context/MusicStore';
import MusicPlayer from './components/MusicPlayer';
import { useAsyncEffect } from './hooks';
import { OrgAlbumEditor, OrgAlbumList, OrgAlbumSearch, OrgArtistList } from './screens/OrganizationWizard';
import { useTracks, importSongs, useMusic } from './utilities';

LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state' ]);

/** @typedef {{ id: string | number } & { [key: string]: any }} ActionListItem */

/**
 * @typedef {Object} NavigationStackParamList
 * @property {undefined} Home
 * @property {{ title: string, items: Record<string, any>[], getDisplayText: (item: Record<string, any>) => string, getId: (item: Record<string, any>) => string, onItemPress: (item: Record<string, any>, i: number) => void }} ActionList
 * @property {{  }} OrgArtistList
 * @property {{ artist: string }} OrgAlbumList
 * @property {{ artist: string, album: string, trackList: any[] }} OrgAlbumEditor
 * @property {{ title: string }} OrgAlbumSearch
 */

/** @type {import('@react-navigation/core').TypedNavigator<NavigationStackParamList, any, any, any, any>} */
const Stack = createStackNavigator();
const App = () => {
  const [state, setState] = useState({ loaded: false, error: false });

  useAsyncEffect(async () => {
    const storagePermission = await Permissions.request(Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    const error = storagePermission !== Permissions.RESULTS.GRANTED;
    setState({ loaded: true, error });
  }, null, []);

  if (!state.loaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'YouTube Music Sucks!' }} />
        <Stack.Screen name="ActionList" component={ActionList} options={({ route }) => ({ title: route.params.title })} />
        {/* <Stack.Screen name="OrgArtistList" component={OrgArtistList} options={{ title: 'Artists With Unorganized Music' }} />
        <Stack.Screen name="OrgAlbumList" component={OrgAlbumList} options={({ route }) => ({ title: `${route.params.artist}'s Unorganized Music` })} />
        <Stack.Screen name="OrgAlbumEditor" component={OrgAlbumEditor} />
        <Stack.Screen name="OrgAlbumSearch" component={OrgAlbumSearch} /> */}
      </Stack.Navigator>
      <MusicPlayer />
    </NavigationContainer>
  );
};

export default App;

/**
 * 
 * @param {Object} props
 * @param {StackNavigationProp<NavigationStackParamList, 'Home'>} props.navigation
 * @returns 
 */
const HomeScreen = ({ navigation }) => {
  const { tracks, albums, artists } = useMusic();

  artists.sort(({ name: aName }, { name: bName }) => aName < bName ? -1 : aName > bName ? 1 : 0);
  albums.sort(({ name: aName }, { name: bName }) => aName < bName ? -1 : aName > bName ? 1 : 0);

  /**
   * 
   * @param {import('./utilities').YtmsTrack[]} songs 
   * @param {number} index 
   */
  const playSong = async (songs, index) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(songs.map(song => (console.log(song.duration), {
      url: `file://${song.filePath}`,
      title: song.name,
      artist: song.artistName,
      artwork: albums.find(a => a.albumID === song.albumID)?.artworkURL,
      duration: song.duration,
      album: song.albumName,
    })));
    await TrackPlayer.skip(index);

    TrackPlayer.play();
  };

  /** @type {(artist: import('./utilities').YtmsArtist) => Promise<void>} */
  const viewAlbumsFromArtist = async artist => {
    const artistAlbums = albums.filter(a => a.artistID === artist.artistID);
    navigation.push('ActionList', { title: artist.name, items: artistAlbums, getDisplayText: album => album.name, getId: album => album.albumID, onItemPress: viewSongsFromAlbum });
  };

  /** @type {(album: import('./utilities').YtmsAlbum) => Promise<void>} */
  const viewSongsFromAlbum = async album => {
    const albumSongs = tracks.filter(t => t.albumID === album.albumID);
    navigation.push('ActionList', { title: `${album.artistName} - ${album.name}`, items: albumSongs, getDisplayText: song => song.name, getId: song => song.trackID, onItemPress: (song, i) => playSong(albumSongs, i) });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ flex: 1 }}>Artists found: {artists.length}</Text>
        <Text style={{ flex: 1 }}>Albums found: {albums.length}</Text>
        <Text style={{ flex: 1 }}>Songs found: {tracks.length}</Text>
      </View>
      <View style={styles.main}>
        {/* <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrgArtistList', {})}>
          <Text>Organization Wizard</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.navItem} onPress={importSongs}>
          <Text>Import New Music</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { title: 'All Artists', items: artists, getDisplayText: artist => artist.name, getId: artist => artist.artistID, onItemPress: viewAlbumsFromArtist })}>
          <Text>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { title: 'All Albums', items: albums, getDisplayText: album => album.name, getId: album => album.albumID, onItemPress: viewSongsFromAlbum })}>
          <Text>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { title: 'All Songs', items: tracks, getDisplayText: song => song.name, getId: song => song.trackID, onItemPress: (song, i) => playSong(tracks, i) })}>
          <Text>Songs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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