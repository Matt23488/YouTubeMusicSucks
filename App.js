import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, PermissionsAndroid, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import Permissions from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongList from './components/SongList';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="SongList"
          component={SongList}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
};
export default App;

class HomeScreen extends React.Component {
    state = {
      storagePermission: '',
      songs: [],
    };

    async componentDidMount() {
      const storagePermission = await Permissions.request('android.permission.READ_EXTERNAL_STORAGE');
      this.setState({ storagePermission });

      let songs = await AsyncStorage.getItem('testStorageKey');
      if (songs) {
        songs = JSON.parse(songs);
        this.setState({ songs });
      }
    }

    _saveSongs = () => {
      const songs = JSON.stringify(this.state.songs);
      AsyncStorage.setItem('testStorageKey', songs);
    };

    _getSongs = () => {
      this.setState({ songs: [] });
      DeviceEventEmitter.addListener('onBatchReceived', ({ batch }) => {
        //if (this.state.songs.length > 50) return;

        console.log(batch);
        this.setState({ songs: this.state.songs.concat(batch) });
      });
      MusicFiles.getAll({
          id: true,
          blured: false,
          artist: true,
          duration: true,
          cover: true,
          title: true,
          date: true,
          lyrics: true,
          batchNumber: 100,
          fields: ['id','title','artwork','duration','artist','genre','lyrics','albumTitle','cover']
      }).catch(console.log);
    };

    _getAlbums = () => {
      return this.state.songs.reduce((acc, song) => {
        let album = acc.find(a => a.title === song.album);
        if (!album) {
          album = { title: song.album, id: song.album, songs: [song] };
          acc.push(album);
        } else album.songs.push(song);

        return acc;
      },[]);
    };

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={{ flex: 1 }} onPress={this._getSongs}>Load Songs</Text>
            <Text style={{ flex: 1 }}>Songs found: {this.state.songs.length}</Text>
          </View>
          <View style={styles.main}>
            {/* <TouchableOpacity style={{ flex: 1 }} onPress={this._saveSongs}><Text>Save Songs</Text></TouchableOpacity> */}
            <TouchableOpacity style={styles.navItem} onPress={() => this.props.navigation.navigate('SongList', { songs: this.state.songs })}>
              <Text>Songs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => this.props.navigation.navigate('SongList', { songs: this._getAlbums() })}>
              <Text>Albums</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
        // return (
        //     <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        //         <Text onPress={this._getSongs.bind(this)}>get songs</Text>
        //         {this.state.songs.map(song => (
        //           <Text key={song.id}>{song.title}</Text>
        //         ))}
        //     </ScrollView>
        // )
    }
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
});