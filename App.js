import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Permissions from 'react-native-permissions';
import TrackPlayer from 'react-native-track-player';
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
  const [[artists, albums, songs], refreshMusic] = useMusicStore();

  const setupPromise = TrackPlayer.setupPlayer();
  const playSong = song => {
    setupPromise.then(async () => {
      console.log(`playing '${song.title}'`);
      await TrackPlayer.add({
        id: song.id,
        url: song.path,
        title: song.title,
        artist: song.artist,
        album: song.album,
      });
      TrackPlayer.play();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ flex: 1 }} onPress={refreshMusic}>Load Music</Text>
        <Text style={{ flex: 1 }}>Artists found: {artists.length}</Text>
        <Text style={{ flex: 1 }}>Albums found: {albums.length}</Text>
        <Text style={{ flex: 1 }}>Songs found: {songs.length}</Text>
      </View>
      <View style={styles.main}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: artists, getDisplayText: artist => artist.artist, onItemPress: artist => alert(JSON.stringify(artist)) })}>
          <Text>Artists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: albums, getDisplayText: album => album.album, onItemPress: album => alert(JSON.stringify(album)) })}>
          <Text>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ActionList', { items: songs, getDisplayText: song => song.title, onItemPress: playSong })}>
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