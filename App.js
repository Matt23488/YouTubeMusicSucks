import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LogBox, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import Permissions from 'react-native-permissions';
import TrackPlayer from 'react-native-track-player';
import ActionList from './components/ActionList';
import { useMusicStore } from './context/MusicStore';
import MusicPlayer from './components/MusicPlayer';

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
          <MusicPlayer />
        </NavigationContainer>
    );
  }
};

const HomeScreen = ({ navigation, route }) => {
  const [[artists, albums/*, songs*/], setMusic] = React.useState([[], [], []]);

  React.useEffect(async () => {
    const getArtists = RNAndroidAudioStore.getArtists();
    const getAlbums = RNAndroidAudioStore.getAlbums();
    //const getSongs = RNAndroidAudioStore.getSongs();

    const [artists, albums] = await Promise.all([getArtists, getAlbums/*, getSongs*/]);
    artists.sort((a, b) => a.artist < b.artist ? -1 : a.artist > b.artist ? 1 : 0);
    albums.sort((a, b) => a.album < b.album ? -1 : a.album > b.album ? 1 : 0);
    setMusic([artists, albums]);
  });

  // const [artistAlbums, setArtistAlbums] = React.useState([]);
  // const getAlbumsFromArtist = artist => {
  //   RNAndroidAudioStore.getAlbums({ artist }).then(setArtistAlbums);
  // };

  // const [albumSongs, setAlbumSongs] = React.useState([]);
  // const getSongsFromAlbum = (artist, album) => {
  //   RNAndroidAudioStore.getSongs({ artist, album }).then(setAlbumSongs);
  // };

  const playSong = async (songs, index) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(songs.map(song => ({
      url: `file://${song.path}`,
      title: song.title,
      artist: song.artist,
      artwork: song.cover,
      duration: song.duration,
    })));
    await TrackPlayer.skip(index);

    TrackPlayer.play();
  };

  const viewAlbumsFromArtist = artist => {
    RNAndroidAudioStore.getAlbums({ artist }).then(albums => {
      albums.sort((a, b) => a.album < b.album ? -1 : a.album > b.album ? 1 : 0);
      navigation.push('ActionList', { items: albums, getDisplayText: album => album.album, onItemPress: album => viewSongsFromAlbum(album.author, album.album) });
    });
  };

  const viewSongsFromAlbum = (artist, album) => {
    RNAndroidAudioStore.getSongs({ artist, album }).then(songs => {
      navigation.push('ActionList', { items: songs, getDisplayText: song => song.title, onItemPress: (song, i) => playSong(songs, i) });
    });
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