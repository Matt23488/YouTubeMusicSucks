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
import OrganizationWizard from './screens/OrganizationWizard';
import { useAsyncEffect } from './hooks';

LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state' ]);

/** @typedef {{ id: string | number } & { [key: string]: any }} ActionListItem */

/**
 * @typedef {Object} NavigationStackParamList
 * @property {undefined} Home
 * @property {{ items: ActionListItem[], getDisplayText: (item: ActionListItem) => string, onItemPress: (item: ActionListItem, i: number) => void }} ActionList
 * @property {{}} OrganizationWizard
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ActionList" component={ActionList} />
        <Stack.Screen name="OrganizationWizard" component = {OrganizationWizard} />
      </Stack.Navigator>
      <MusicPlayer />
    </NavigationContainer>
  );
};

export default App;
// export default class App extends React.Component {
//   state = {
//     loaded: false,
//     error: false,
//   };

//   async componentDidMount() {
//     const storagePermission = await Permissions.request(Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//     const error = storagePermission !== Permissions.RESULTS.GRANTED;

//     this.setState({ loaded: true, error });
//   }

//   render() {
//     if (!this.state.loaded) return null;

//     return (
//         <NavigationContainer>
//           <Stack.Navigator>
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="ActionList" component={ActionList} />
//             <Stack.Screen name="OrganizationWizard" component = {OrganizationWizard} />
//           </Stack.Navigator>
//           <MusicPlayer />
//         </NavigationContainer>
//     );
//   }
// };

/**
 * 
 * @param {Object} props
 * @param {StackNavigationProp<NavigationStackParamList, 'Home'>} props.navigation
 * @returns 
 */
const HomeScreen = ({ navigation }) => {
  const [[artists, albums/*, songs*/], setMusic] = React.useState([[], [], []]);

  React.useEffect(async () => {
    const getArtists = RNAndroidAudioStore.getArtists();
    const getAlbums = RNAndroidAudioStore.getAlbums();
    //const getSongs = RNAndroidAudioStore.getSongs();

    const [artists, albums] = await Promise.all([getArtists, getAlbums/*, getSongs*/]);
    //console.log(artists, albums);
    artists.sort((a, b) => a.artist < b.artist ? -1 : a.artist > b.artist ? 1 : 0);
    albums.sort((a, b) => a.album < b.album ? -1 : a.album > b.album ? 1 : 0);
    setMusic([artists, albums]);
  }, []);

  // const [artistAlbums, setArtistAlbums] = React.useState([]);
  // const getAlbumsFromArtist = artist => {
  //   RNAndroidAudioStore.getAlbums({ artist }).then(setArtistAlbums);
  // };

  // const [albumSongs, setAlbumSongs] = React.useState([]);
  // const getSongsFromAlbum = (artist, album) => {
  //   RNAndroidAudioStore.getSongs({ artist, album }).then(setAlbumSongs);
  // };

  /**
   * 
   * @param {import('@yajanarao/react-native-get-music-files').Song[]} songs 
   * @param {number} index 
   */
  const playSong = async (songs, index) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(songs.map(song => ({
      url: `file://${song.path}`,
      title: song.title,
      artist: song.artist,
      artwork: song.cover,
      duration: song.duration,
      album: song.album,
    })));
    await TrackPlayer.skip(index);

    TrackPlayer.play();
  };

  /** @type {(artist: string) => Promise<void>} */
  const viewAlbumsFromArtist = async artist => {
    const [albums, songs] = await Promise.all([RNAndroidAudioStore.getAlbums({ artist }), RNAndroidAudioStore.getSongs({ artist })]);
    // RNAndroidAudioStore.getAlbums({ artist }).then(albums => {
    albums.sort((a, b) => a.album < b.album ? -1 : a.album > b.album ? 1 : 0);
    navigation.push('ActionList', { items: albums.concat({ album: 'All Songs', author: artist, id: -1, numberOfSongs: songs.length }), getDisplayText: album => album.album, onItemPress: album => viewSongsFromAlbum(album.author, album.album) });
    // });
  };

  /** @type {(artist: string, album: string) => Promise<void>} */
  const viewSongsFromAlbum = async (artist, album) => {
    const songs = await RNAndroidAudioStore.getSongs({ artist, album: album === 'All Songs' ? undefined : album });
    console.log(artist);
    // RNAndroidAudioStore.getSongs({ artist, album }).then(songs => {
    navigation.push('ActionList', { items: songs, getDisplayText: song => song.title, onItemPress: (song, i) => playSong(songs, i) });
    // });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={{ flex: 1 }} onPress={refreshMusic}>Load Music</Text> */}
        <Text style={{ flex: 1 }}>Artists found: {artists.length}</Text>
        <Text style={{ flex: 1 }}>Albums found: {albums.length}</Text>
        {/* <Text style={{ flex: 1 }}>Songs found: {songs.length}</Text> */}
      </View>
      <View style={styles.main}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OrganizationWizard', {})}>
          <Text>Organization Wizard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: artists, getDisplayText: artist => artist.artist, onItemPress: artist => viewAlbumsFromArtist(artist.artist) })}>
          <Text>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: albums, getDisplayText: album => album.album, onItemPress: album => viewSongsFromAlbum(album.author, album.album) })}>
          <Text>Albums</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: songs, getDisplayText: song => song.title, onItemPress: alert })}>
          <Text>Songs</Text>
        </TouchableOpacity> */}
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