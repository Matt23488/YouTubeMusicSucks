import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as spotify from '../spotify';

const MusicPlayer = () => {
    const [expanded, setExpanded] = useState(false);
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const [trackArtwork, setTrackArtwork] = useState();
    const [trackTitle, setTrackTitle] = useState();
    const [trackArtist, setTrackArtist] = useState();
  
    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackError], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            //console.log(track);

            const {title, artist, artwork} = track || {};
            try {
                const results = await spotify.search({ q: title, types: ['track'] });
                // TODO: Better matching. Tbh I should do it at the album level.
                // actually I should build in functionality to update metadata on the music
                // and cache it using async storage. Then just pull the track info from there to use here.
                const match = results.tracks.items[0];
                // console.log(match.name);
                // console.log(match.artists[0].name);
                // console.log(match.album.images[0].url);
                setTrackTitle(match.name);
                setTrackArtist(match.artists[0].name);
                setTrackArtwork(match.album.images[0].url);
            } catch (e) {
                console.log(e);
                setTrackTitle(title);
                setTrackArtist(artist);
                setTrackArtwork(artwork);
            }

        }
        else console.log(event);
    });

    const styles = expanded ? expandedStyles : collapsedStyles;

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

    const skipTrack = async backwards => {
        // TODO: getRepeatMode() was not working on the Java side it seems
        const [currentTrack, queue, repeatMode] = await Promise.all([TrackPlayer.getCurrentTrack(), TrackPlayer.getQueue(), Promise.resolve(RepeatMode.Queue)]);
        if (currentTrack === null) return;

        if (backwards) {
            if (currentTrack === 0 && repeatMode === RepeatMode.Off) return;
            TrackPlayer.skipToPrevious();
        } else {
            if (currentTrack === queue.length - 1 && repeatMode === RepeatMode.Off) return;
            TrackPlayer.skipToNext();
        }
    };

    useEffect(() => {
        (async () => {
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
            await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        })();

        return async () => {
            console.log('destroy');
            await TrackPlayer.destroy();
        };
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleExpanded} style={styles.expandButton}>
                <Icon name="grip-lines" color="black" />
            </TouchableOpacity>
            <Image style={styles.artwork} source={{uri: `${trackArtwork}`}} />
            <Text>{trackArtist && `${trackArtist} - `}{trackTitle || 'none'}</Text>
            <Slider
                style={styles.progressContainer}
                value={progress.position}
                minimumValue={0}
                maximumValue={progress.duration}
                thumbTintColor="#7f00ff"
                minimumTrackTintColor="#7f00ff"
                maximumTrackTintColor="black"
                onSlidingComplete={async value => {
                    await TrackPlayer.seekTo(value);
                }}
            />
            <View style={styles.playbackControls}>
                <TouchableWithoutFeedback onPress={() => skipTrack(true)}>
                    <Icon name="step-backward" size={24} color="black" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState)}>
                    <Icon name={playbackState === State.Playing ? 'pause' : 'play'} size={24} color="black" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => skipTrack(false)}>
                    <Icon name="step-forward" size={24} color="black" />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const collapsedStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandButton: {
        backgroundColor: '#ccc',
        borderColor: 'transparent',
        borderBottomColor: '#333',
        borderWidth: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playbackControls: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    artwork: {
        display: 'none',
    },
    progressContainer: {
      height: 10,
      width: '95%',
      flexDirection: 'row',
    },
});

const expandedStyles = StyleSheet.create({
    container: {
        ...collapsedStyles.container,
        height: '100%',
    },
    expandButton: collapsedStyles.expandButton,
    playbackControls: collapsedStyles.playbackControls,
    artwork: {
      width: 240,
      height: 240,
      marginTop: 30,
      backgroundColor: 'grey',
    },
    progressContainer: collapsedStyles.progressContainer,
});

export default MusicPlayer;