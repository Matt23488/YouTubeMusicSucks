import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import TrackPlayer, { Capability, Event, State, usePlaybackState, useTrackPlayerEvents } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MusicPlayer = () => {
    const [expanded, setExpanded] = useState(false);
    const playbackState = usePlaybackState();

    const [trackArtwork, setTrackArtwork] = useState();
    const [trackTitle, setTrackTitle] = useState();
    const [trackArtist, setTrackArtist] = useState();
  
    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            console.log(track);
            const {title, artist, artwork} = track || {};
            setTrackTitle(title);
            setTrackArtist(artist);
            setTrackArtwork(artwork);
        }
    });

    const extraStyles = expanded ? styles.expanded : {};

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };
    
    const togglePlayback = async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack == null) {
            // TODO: Perhaps present an error or restart the playlist?
        } else {
            if (playbackState === State.Paused) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    };

    useEffect(() => {
        const setup = async () => {
            console.log('setup');
            await TrackPlayer.setupPlayer({});
            await TrackPlayer.updateOptions({
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                ],
                compactCapabilities: [Capability.Play, Capability.Pause],
            });
        };
        setup();

        return async () => {
            console.log('destroy');
            await TrackPlayer.destroy();
        };
    }, []);

    return (
        <View style={[styles.container, extraStyles]}>
            <TouchableOpacity onPress={toggleExpanded} style={{ borderWidth: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="grip-lines" color="black" />
            </TouchableOpacity>
            {/* <Image style={styles.artwork} source={{uri: `${trackArtwork}`}} />
            <Text style={styles.titleText}>{trackTitle}</Text>
            <Text style={styles.artistText}>{trackArtist}</Text> */}
            <View style={styles.playbackControls}>
                <TouchableWithoutFeedback onPress={() => TrackPlayer.skipToPrevious()}>
                    <Icon name="step-backward" size={30} color="black" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState)}>
                    <Icon name={playbackState === State.Playing ? 'pause' : 'play'} size={30} color="black" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => TrackPlayer.skipToNext()}>
                    <Icon name="step-forward" size={30} color="black" />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expanded: {
        height: '100%',
    },
    playbackControls: {
        width: '100%',
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    artwork: {
      width: 240,
      height: 240,
      marginTop: 30,
      backgroundColor: 'grey',
    },
    titleText: {
      fontSize: 18,
      fontWeight: '600',
      color: 'white',
      marginTop: 30,
    },
    artistText: {
      fontSize: 16,
      fontWeight: '200',
      color: 'white',
    },
});

export default MusicPlayer;