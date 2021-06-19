import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ImageBackground } from 'react-native';
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MusicPlayer = () => {
    const [expanded, setExpanded] = useState(false);
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const [trackArtwork, setTrackArtwork] = useState<string>();
    const [trackTitle, setTrackTitle] = useState<string>();
    const [trackArtist, setTrackArtist] = useState<string>();
    const [trackAlbum, setTrackAlbum] = useState<string>();

    useEffect(() => {
        console.log('setting up player');
        TrackPlayer.setupPlayer({}).then(async () => {
            console.log('player setup complete');
            await TrackPlayer.updateOptions({
                stopWithApp: true,
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                    Capability.SeekTo,
                ],
                compactCapabilities: [Capability.Play, Capability.Pause],
            });
            await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        });

        return () => {
            TrackPlayer.destroy();
        };
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackError], async event => {
        if (event.type === Event.PlaybackTrackChanged && typeof event.nextTrack === 'number') {
            const track = await TrackPlayer.getTrack(event.nextTrack);

            // const { title, artist, artwork } = track ?? {};
            setTrackTitle(track?.title);
            setTrackArtist(track?.artist);
            setTrackArtwork(track?.artwork as string);
            setTrackAlbum(track?.album);
        }
        else console.log(event);
    });
    
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

    const skipTrack = async (backwards: boolean) => {
        // TODO: getRepeatMode() was not working on the Java side it seems
        const [currentTrack, queue, repeatMode] = await Promise.all([TrackPlayer.getCurrentTrack(), TrackPlayer.getQueue(), Promise.resolve(RepeatMode.Queue)]);
        if (currentTrack === null) return;

        if (backwards) {
            if (currentTrack === 0 && repeatMode === RepeatMode.Off) return;
            if (progress.position < 3) TrackPlayer.skipToPrevious();
            else TrackPlayer.skip(currentTrack);
        } else {
            if (currentTrack === queue.length - 1 && repeatMode === RepeatMode.Off) return;
            TrackPlayer.skipToNext();
        }
    };

    // const visibleStates = [State.Playing, State.Paused, State.Buffering];
    // if (!visibleStates.includes(playbackState)) return null;

    const styles = expanded ? expandedStyles : collapsedStyles;
    return (
        <View style={styles.container}>
            <Image source={require('../images/background.jpg')} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, }} />
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
                <Icon name={expanded ? 'chevron-down' : 'chevron-up'} color="white" size={16} />
            </TouchableOpacity>
            <Image style={styles.artwork} source={{uri: `${trackArtwork}`}} />
            <Text style={{ color: '#fff' }}>{trackArtist && `${trackArtist} - `}{trackTitle || 'none'}</Text>
            {/* <View style={styles.infoLine}>
                <Icon name="music" color="white" size={16} />
                <Text style={{}}>{trackTitle}</Text>
            </View>
            <View style={styles.infoLine}>
                <Icon name="user" color="white" size={16} />
                <Text style={{}}>{trackArtist}</Text>
            </View>
            <View style={styles.infoLine}>
                <Icon name="compact-disc" color="white" size={16} />
                <Text style={{}}>{trackAlbum}</Text>
            </View> */}
            <Slider
                style={styles.progressContainer}
                value={progress.position}
                minimumValue={0}
                maximumValue={progress.duration}
                thumbTintColor="white"
                minimumTrackTintColor="white"
                maximumTrackTintColor="white"
                onSlidingComplete={async value => {
                    await TrackPlayer.seekTo(value);
                }}
            />
            <View style={styles.playbackControls}>
                <TouchableWithoutFeedback onPress={() => skipTrack(true)}>
                    <Icon name="step-backward" size={24} color="white" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => togglePlayback()}>
                    <Icon name={playbackState === State.Playing ? 'pause' : 'play'} size={24} color="white" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => skipTrack(false)}>
                    <Icon name="step-forward" size={24} color="white" />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const collapsedStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        backgroundColor: '#336',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    expandButton: {
        backgroundColor: '#4f007f',
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
    infoLine: {
        display: 'none',
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
    infoLine: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default MusicPlayer;