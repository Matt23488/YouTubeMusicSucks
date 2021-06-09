import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ActionList = ({ navigation, route }) => {
    return (
        <ScrollView>
            {route.params.items.map((item, i) => (
                <TouchableOpacity key={route.params.getId(item)} onPress={() => route.params.onItemPress(item, i)} style={styles.item}>
                    <Text>{route.params.getDisplayText(item)}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default ActionList;

const styles = StyleSheet.create({
    item: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});