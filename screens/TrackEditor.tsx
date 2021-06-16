import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, ScrollView, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { useMusic } from '../utilities/storage';
import { YtmsNavigationParamList } from './YtmsNavigator';

// TODO: Allow moving to another album, and create a new album and even artist if necessary
const TrackEditor = ({ navigation, route }: TrackEditorProperties) => {
    const [{ tracks }, saveChanges] = useMusic();
    const track = tracks.find(t => t.trackId === route.params.trackId)!;

    const [tempName, setTempName] = useState(track.name);

    const saveTrack = () => {
        track.name = tempName;
        saveChanges();
        navigation.pop();
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} defaultValue={tempName} onChangeText={setTempName} />
            <TouchableOpacity onPress={saveTrack} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

interface TrackEditorProperties {
    navigation: StackNavigationProp<YtmsNavigationParamList, 'TrackEditor'>;
    route: RouteProp<YtmsNavigationParamList, 'TrackEditor'>;
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

export default TrackEditor;