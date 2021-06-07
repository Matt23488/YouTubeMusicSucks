import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import { calculateStringCloseness, getUnorganizedTracks, orderByCloseness } from '../utilities';
import * as spotify from '../spotify';
import { NavigationContainer } from '@react-navigation/native';
import { useAsyncEffect } from '../hooks';


// /** @type {<ParamList extends Record<string, object | undefined>>() => import("@react-navigation/native").TypedNavigator<ParamList, StackNavigationState<Record<string, object | undefined>>, StackNavigationOptions, StackNavigationEventMap, typeof StackNavigator>} */
// const createOrganizationNavigator = createStackNavigator;
//  /** @type {import('@react-navigation/core').TypedNavigator<OrganizationNavigationParamList, any, any, any, any>} */
// const OrganizationNavigator = createStackNavigator();

// /**
//  * @typedef {Object} OrganizationNavigationParamList
//  * @property {{}} ArtistList
//  * @property {{}} AlbumList
//  * @property {{}} AlbumEditor
//  * @property {{}} AlbumSearch
//  */

/**
 * 
 * @param {Object} props
 * @param {StackNavigationProp<import('../App').NavigationStackParamList, 'OrgArtistList'>} props.navigation
 * @returns {React.ReactNode}
 */
export const OrgArtistList = ({ navigation, asdf }) => {
    const [artists, setArtists] = useState([]);
    useEffect(() => {
        //console.log('storage keys', AsyncStorage.getAllKeys())
        //AsyncStorage.getAllKeys((err, keys) => console.log('storage keys', keys));
        //console.log(calculateStringCloseness('abcde', 'abced'));
        // getUnorganizedTracks().then(async tracks => {
        //     const matchedAlbums = await Promise.all(tracks.map(t => RNAndroidAudioStore.getAlbums({ artist: t.artist }).then(a => orderByCloseness(a, t.album, obj => obj.album))));
        //     const asdf = tracks.map((t, i) => ({ t, albums: JSON.stringify(matchedAlbums[i]) }));
        //     console.log(asdf);
        // });

        RNAndroidAudioStore.getArtists().then(artists => artists.sort((a, b) => a.artist < b.artist ? -1 : a.artist > b.artist ? 1 : 0)).then(setArtists);
    }, []);

    /** @type {(name: string) => Promise<void>} */
    const searchArtist = async name => {
        const result = await spotify.search({ q: name, types: ['artist'] });
        console.log(result.artists.items.map(i => ({ name: i.name, matchProbability: calculateStringCloseness(name, i.name) })).sort((a, b) => b.matchProbability - a.matchProbability));
    };

    // return (
    //     <NavigationContainer independent={true}>
    //         <OrganizationNavigator.Navigator>
    //             <OrganizationNavigator.Screen name="ArtistList" component={ArtistList} />
    //             <OrganizationNavigator.Screen name="AlbumList" component={AlbumList} />
    //             <OrganizationNavigator.Screen name="AlbumEditor" component={AlbumEditor} />
    //             <OrganizationNavigator.Screen name="AlbumSearch" component={AlbumSearch} />
    //         </OrganizationNavigator.Navigator>
    //     </NavigationContainer>
    // );
    return (
        <ScrollView>
            {artists.map(a => (
                <TouchableOpacity key={a.id} style={styles.artist} onPress={() => navigation.navigate('OrgAlbumList', { artist: a.artist })}>
                    <Text>{a.artist}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

/**
 * 
 * @param {Object} props 
 * @param {StackNavigationProp<import('../App').NavigationStackParamList, 'OrgAlbumEditor'>} props.navigation
 * @param {import('@react-navigation/core').RouteProp<import('../App').NavigationStackParamList, 'OrgAlbumEditor'>} props.route
 * @param {string[]} props.trackList
 * @returns {React.ReactNode}
 */
export const OrgAlbumEditor = ({ route, trackList }) => {
    const [state, setState] = useState({ uri: '', artist: route.params.artist, album: route.params.album, tracks: [] });
    useAsyncEffect(async () => {
        const result = await spotify.search({ q: route.params.album, types: ['album'] });
        const matches = orderByCloseness(result.albums.items, `${route.params.artist}|${route.params.album}`, obj => `${obj.artists[0].name}|${obj.name}`);
        let tracks = [];
        if (matches[0]) {
            const trackList = await spotify.getAlbumTrackList({ album: matches[0].href });
            tracks = trackList.tracks.items.map(t => ({ trackName: t.name, trackNum: t.track_number }));
        }
        setState({ uri: matches[0]?.images?.[0]?.url, artist: matches[0]?.artists?.[0]?.name, album: matches[0]?.name, tracks });
    }, null, []);

    // if (image) return <Image style={styles.artwork} source={{ uri: image }} />
    // else return <Text>Not Found</Text>;
    return (
        <ScrollView style={{  }}>
            {state.uri ? <Image style={styles.artwork} source={{ uri: state.uri }} /> : null}
            <Text>{state.artist ?? route.params.artist}</Text>
            <Text>{state.album ?? route.params.album}</Text>
            {state.tracks.map(t => (
                <Text key={t.trackNum}>{t.trackNum}. {t.trackName}</Text>
            ))}
        </ScrollView>
    )
};

export const OrgAlbumSearch = props => {
    return <Text>Album Search</Text>;
};

/**
 * 
 * @param {Object} props
 * @param {StackNavigationProp<import('../App').NavigationStackParamList, 'OrgAlbumList'>} props.navigation
 * @param {import('@react-navigation/core').RouteProp<import('../App').NavigationStackParamList, 'OrgAlbumList'>} props.route
 * @returns {React.ReactNode}
 */
export const OrgAlbumList = ({ navigation, route }) => {
    const [albums, setAlbums] = useState([]);
    useEffect(() => {
        RNAndroidAudioStore.getAlbums({ artist: route.params.artist }).then(albums => albums.sort((a, b) => a.album < b.album ? -1 : a.album > b.album ? 1 : 0)).then(setAlbums);
    }, []);

    return (
        <ScrollView>
            {albums.map(a => (
                <TouchableOpacity key={a.id} style={styles.artist} onPress={() => navigation.navigate('OrgAlbumEditor', { artist: a.author, album: a.album })}>
                    <Text>{a.album}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    artist: {
        // padding: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    artwork: {
      width: 240,
      height: 240,
      backgroundColor: 'grey',
    },
});



// export default OrganizationWizard;