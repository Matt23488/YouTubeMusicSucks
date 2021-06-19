import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { NavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { importSongs, useMusic, YtmsAlbum, YtmsArtist, YtmsTrack } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const HomeScreen = (props: { navigation: StackNavigationProp<YtmsNavigationParamList, 'HomeScreen'> }) => {
    const { navigation } = props;
    const [{ tracks, albums, playlists, artists }] = useMusic();

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../images/background.jpg')} style={styles.main}>
                <TouchableOpacity style={styles.navItem} onPress={importSongs}>
                    <Icon name="file-import" size={24} color="white" />
                    <Text style={styles.actionText}>Import New Music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ArtistList')}>
                    <Icon name="user" size={24} color="white" />
                    <Text style={styles.actionText}>Artists ({artists.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AlbumList', { artistId: 'all' })}>
                    <Icon name="compact-disc" size={24} color="white" />
                    <Text style={styles.actionText}>Albums ({albums.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PlaylistList')}>
                    <MatIcon name="playlist-music" size={24} color="white" />
                    <Text style={styles.actionText}>Playlists ({playlists.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TrackList', { artistId: 'all' })}>
                    <Icon name="music" size={24} color="white" />
                    <Text style={styles.actionText}>Tracks ({tracks.length})</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: '#336',
    },
    
    main: {
        padding: 10,
        flex: 1,
        // width: '100%',
        resizeMode: 'stretch',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // transform: [{ rotate: '90deg' }],
        // justifyContent: 'center',
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