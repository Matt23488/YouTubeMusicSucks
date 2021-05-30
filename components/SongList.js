import React from 'react';
import { ScrollView, View, Text } from 'react-native';

const SongList = props => {
    return (
        <ScrollView>
            {props.songs.map(song => (
                <View key={song.id}>
                    <Text>{song.title}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default SongList;