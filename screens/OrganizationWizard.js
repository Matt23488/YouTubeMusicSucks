import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import { calculateStringCloseness, getUnorganizedTracks, orderByCloseness } from '../utilities';
import * as spotify from '../spotify';
import { NavigationContainer } from '@react-navigation/native';


// /** @type {<ParamList extends Record<string, object | undefined>>() => import("@react-navigation/native").TypedNavigator<ParamList, StackNavigationState<Record<string, object | undefined>>, StackNavigationOptions, StackNavigationEventMap, typeof StackNavigator>} */
// const createOrganizationNavigator = createStackNavigator;
 /** @type {import('@react-navigation/core').TypedNavigator<OrganizationNavigationParamList, any, any, any, any>} */
const OrganizationNavigator = createStackNavigator();

/**
 * @typedef {Object} OrganizationNavigationParamList
 * @property {{}} ArtistList
 * @property {{}} AlbumList
 * @property {{}} AlbumEditor
 * @property {{}} AlbumSearch
 */

/**
 * 
 * @param {Object} props
 * @param {StackNavigationProp<import('../App').NavigationStackParamList, 'OrganizationWizard'>} props.navigator
 * @returns {React.ReactNode}
 */
const OrganizationWizard = ({ navigator }) => {
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
                <TouchableOpacity key={a.id} style={styles.artist} onPress={() => searchArtist(a.artist)}>
                    <Text>{a.artist}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

/**
 * 
 * @param {Object} props 
 * @param {string[]} props.trackList
 * @returns {React.ReactNode}
 */
const AlbumEditor = props => {
    return <Text>Album Editor</Text>;
};

const AlbumSearch = props => {
    return <Text>Album Search</Text>;
};

const ArtistList = () => <Text>Artist List</Text>;
const AlbumList = () => <Text>Album List</Text>;

const styles = StyleSheet.create({
    artist: {
        // padding: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
});



export default OrganizationWizard;