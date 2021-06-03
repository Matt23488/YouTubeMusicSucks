import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import TrackPlayer, { Capability, Event, State, usePlaybackState, useTrackPlayerEvents } from 'react-native-track-player';

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
        setup();
    }, []);

    return (
        <View style={[styles.container, extraStyles]}>
            <TouchableOpacity onPress={toggleExpanded} style={{ borderWidth: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text>==</Text>
            </TouchableOpacity>
            {/* <Image style={styles.artwork} source={{uri: `${trackArtwork}`}} />
            <Text style={styles.titleText}>{trackTitle}</Text>
            <Text style={styles.artistText}>{trackArtist}</Text> */}
            <View style={styles.playbackControls}>
                <TouchableWithoutFeedback onPress={() => TrackPlayer.skipToPrevious()}>
                    <Text style={styles.secondaryActionButton}>Prev</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState)}>
                    <Text style={styles.primaryActionButton}>
                        {playbackState === State.Playing ? 'Pause' : 'Play'}
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => TrackPlayer.skipToNext()}>
                    <Text style={styles.secondaryActionButton}>Next</Text>
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
        flex: 1,
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
    primaryActionButton: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFD479',
    },
    secondaryActionButton: {
      fontSize: 14,
      color: '#FFD479',
    },
});

export default MusicPlayer;