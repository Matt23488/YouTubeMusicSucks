import React from 'react';
import { ScrollView, View, Text } from 'react-native';

const SongList = ({ navigation, route }) => {
    return (
        <ScrollView>
            {route.params.songs.map(song => (
                <View key={song.id}>
                    <Text>{song.title}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default SongList;