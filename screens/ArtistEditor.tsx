import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, ScrollView, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { useMusic } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

const ArtistEditor = ({ navigation, route }: ArtistEditorProperties) => {
    const [{ artists }, saveChanges] = useMusic();
    const artist = artists.find(a => a.artistId === route.params.artistId)!;

    const [tempName, setTempName] = useState(artist.name);

    const saveArtist = () => {
        artist.name = tempName;
        saveChanges();
        navigation.pop();
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} defaultValue={tempName} onChangeText={setTempName} />
            <TouchableOpacity onPress={saveArtist} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

interface ArtistEditorProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'ArtistEditor'>;
    route: RouteProp<YtmsNavigationParamList, 'ArtistEditor'>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#336',
        padding: 10,
        height: '100%',
    },
    textInput: {
        borderBottomWidth: 1,
        fontSize: 24,
        color: 'white',
        borderColor: 'white',
    },
    saveBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#9f00ff',
        padding: 10,
    },
    saveBtnText: {
        fontSize: 24,
        color: 'white',
    }, 
});

export default ArtistEditor;