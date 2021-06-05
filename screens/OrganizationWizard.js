import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import { calculateStringCloseness } from '../utilities';
import * as spotify from '../spotify';

/**
 * 
 * @param {Object} props
 * @param {StackNavigationProp<import('../App').NavigationStackParamList, 'OrganizationWizard'>} props.navigator
 * @returns 
 */
const OrganizationWizard = ({ navigator }) => {
    const [artists, setArtists] = useState([]);
    useEffect(() => {
        //console.log('storage keys', AsyncStorage.getAllKeys())
        AsyncStorage.getAllKeys((err, keys) => console.log('storage keys', keys));
        console.log(calculateStringCloseness('abcde', 'abced'));

        RNAndroidAudioStore.getArtists().then(artists => artists.sort((a, b) => a.artist < b.artist ? -1 : a.artist > b.artist ? 1 : 0)).then(setArtists);
    }, []);

    /** @type {(name: string) => Promise<void>} */
    const searchArtist = async name => {
        const result = await spotify.search({ q: name, types: ['artist'] });
        console.log(result.artists.items.map(i => ({ name: i.name, matchProbability: calculateStringCloseness(name, i.name) })).sort((a, b) => b.matchProbability - a.matchProbability));
    };

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

const styles = StyleSheet.create({
    artist: {
        // padding: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
});

/**
 * @typedef {Object} YtmsTrack
 * @property {string} rngmfID
 * @property {string} spotifyID
 * @property {string} albumID
 * @property {number} trackNumber
 */

export default OrganizationWizard;