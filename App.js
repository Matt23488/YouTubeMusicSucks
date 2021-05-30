import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, PermissionsAndroid, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import Permissions from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongList from './components/SongList';

const App = () => {
  return (
    <NavigationContainer>

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
        if (this.state.songs.length > 50) return;

        //console.log(batch);
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
          batchNumber: 5,
          fields: ['id','title','artwork','duration','artist','genre','lyrics','albumTitle','cover']
      }).catch(console.log);
    };

    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <Text onPress={this._getSongs}>Load Songs</Text>
          <Text>Songs found: {this.state.songs.length}</Text>
          <TouchableOpacity onPress={this._saveSongs}><Text>Save Songs</Text></TouchableOpacity>
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