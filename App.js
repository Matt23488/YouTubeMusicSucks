import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import Permissions from 'react-native-permissions';
import TrackPlayer, { Capability } from 'react-native-track-player';
import ActionList from './components/ActionList';
import { useMusicStore } from './context/MusicStore';

LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state' ]);

const Stack = createStackNavigator();

export default class App extends React.Component {
  state = {
    loaded: false,
    error: false,
  };

  async componentDidMount() {
    const storagePermission = await Permissions.request(Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    const error = storagePermission !== Permissions.RESULTS.GRANTED;

    this.setState({ loaded: true, error });
  }

  render() {
    if (!this.state.loaded) return null;

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ActionList" component={ActionList} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

const HomeScreen = ({ navigation, route }) => {
  // const [[artists, albums, songs], refreshMusic] = useMusicStore();

  // const setupPromise = TrackPlayer.setupPlayer();
  // const playSong = song => {
  //   setupPromise.then(async () => {
  //     console.log(`playing '${song.title}'`);
  //     await TrackPlayer.add({
  //       id: song.id,
  //       url: song.path,
  //       title: song.title,
  //       artist: song.artist,
  //       album: song.album,
  //     });
  //     TrackPlayer.play();
  //   });
  // };

  const [[artists, albums], setMusic] = React.useState([[], []]);
  const [isTrackPlayerInit, setIsTrackPlayerInit] = React.useState(false);

  React.useEffect(async () => {
    const getArtists = RNAndroidAudioStore.getArtists();
    const getAlbums = RNAndroidAudioStore.getAlbums();

    Promise.all([getArtists, getAlbums]).then(setMusic);
  });

  React.useEffect(async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      //stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });
    // // TrackPlayer.
    setIsTrackPlayerInit(true);
  });

  // const [artistAlbums, setArtistAlbums] = React.useState([]);
  // const getAlbumsFromArtist = artist => {
  //   RNAndroidAudioStore.getAlbums({ artist }).then(setArtistAlbums);
  // };

  // const [albumSongs, setAlbumSongs] = React.useState([]);
  // const getSongsFromAlbum = (artist, album) => {
  //   RNAndroidAudioStore.getSongs({ artist, album }).then(setAlbumSongs);
  // };
  const viewAlbumsFromArtist = artist => {
    RNAndroidAudioStore.getAlbums({ artist }).then(albums => {
      navigation.push('ActionList', { items: albums, getDisplayText: album => album.album, onItemPress: album => viewSongsFromAlbum(album.author, album.album) });
    });
  };

  const viewSongsFromAlbum = (artist, album) => {
    RNAndroidAudioStore.getSongs({ artist, album }).then(songs => {
      navigation.push('ActionList', { items: songs, getDisplayText: song => song.title, onItemPress: playSong });
    });
  };

  // TODO: Look at https://www.npmjs.com/package/react-native-sound-player since TrackPlayer is not working properly...
  const playSong = async song => {
    if (!isTrackPlayerInit) return;

    const url = `file://${song.path}`;
    console.log(`playing ${url}`);
    await TrackPlayer.add({
      id: song.id,
      url,
      //type: 'default',
      title: song.title,
      album: song.album,
      artist: song.artist,
    });

    await TrackPlayer.play();
    await TrackPlayer.pause();
    setTimeout(() => TrackPlayer.play(), 1000);
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
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: artists, getDisplayText: artist => artist.artist, onItemPress: artist => viewAlbumsFromArtist(artist.artist) })}>
          <Text>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: albums, getDisplayText: album => album.album, onItemPress: album => viewSongsFromAlbum(album.author, album.album) })}>
          <Text>Albums</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: songs, getDisplayText: song => song.title, onItemPress: playSong })}>
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