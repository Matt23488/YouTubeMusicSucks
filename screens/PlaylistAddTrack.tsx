import React from 'react'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { YtmsNavigationParamList } from './YtmsNavigator';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { importSongs } from '../utilities/storage';

const PlaylistAddTrack = ({ route, navigation }: PlaylistAddTrackProperties) => {
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PlaylistArtistList', route.params)}>
                    <Icon name="user" size={24} color="white" />
                    <Text style={styles.actionText}>Artists</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PlaylistAlbumList', route.params)}>
                    <Icon name="compact-disc" size={24} color="white" />
                    <Text style={styles.actionText}>Albums</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PlaylistTrackList', route.params)}>
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

interface PlaylistAddTrackProperties {
    route: RouteProp<YtmsNavigationParamList, 'PlaylistAddTrack'>;
    navigation: StackNavigationProp<YtmsNavigationParamList, 'PlaylistAddTrack'>;
}

export default PlaylistAddTrack;