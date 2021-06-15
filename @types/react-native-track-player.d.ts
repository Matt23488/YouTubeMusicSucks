// // It seems the TypeScript definition files for the 2.0 release are broken in TypeScript, so I just basically copied them from the JS version
// declare module 'react-native-track-player' {
//     export enum IOSCategory {
//         Playback = "playback",
//         PlayAndRecord = "playAndRecord",
//         MultiRoute = "multiRoute",
//         Ambient = "ambient",
//         SoloAmbient = "soloAmbient",
//         Record = "record"
//     }
//     export enum IOSCategoryMode {
//         Default = "default",
//         GameChat = "gameChat",
//         Measurement = "measurement",
//         MoviePlayback = "moviePlayback",
//         SpokenAudio = "spokenAudio",
//         VideoChat = "videoChat",
//         VideoRecording = "videoRecording",
//         VoiceChat = "voiceChat",
//         VoicePrompt = "voicePrompt"
//     }
//     export enum IOSCategoryOptions {
//         MixWithOthers = "mixWithOthers",
//         DuckOthers = "duckOthers",
//         InterruptSpokenAudioAndMixWithOthers = "interruptSpokenAudioAndMixWithOthers",
//         AllowBluetooth = "allowBluetooth",
//         AllowBluetoothA2DP = "allowBluetoothA2DP",
//         AllowAirPlay = "allowAirPlay",
//         DefaultToSpeaker = "defaultToSpeaker"
//     }
//     export interface PlayerOptions {
//         minBuffer?: number;
//         maxBuffer?: number;
//         playBuffer?: number;
//         maxCacheSize?: number;
//         iosCategory?: IOSCategory;
//         iosCategoryMode?: IOSCategoryMode;
//         iosCategoryOptions?: IOSCategoryOptions[];
//         /**
//          * Indicates whether the player should automatically delay playback in order to minimize stalling.
//          * Defaults to `false`.
//          */
//         waitForBuffer?: boolean;
//         /**
//          * Indicates whether the player should automatically update now playing metadata data in control center / notification.
//          * Defaults to `true`.
//          */
//         autoUpdateMetadata?: boolean;
//     }
//     export enum RatingType {
//         Heart,
//         ThumbsUpDown,
//         ThreeStars,
//         FourStars,
//         FiveStars,
//         Percentage
//     }
//     export interface FeedbackOptions {
//         /** Marks wether the option should be marked as active or "done" */
//         isActive: boolean;
//         /** The title to give the action (relevant for iOS) */
//         title: string;
//     }
//     export enum Capability {
//         Play,
//         PlayFromId,
//         PlayFromSearch,
//         Pause,
//         Stop,
//         SeekTo,
//         Skip,
//         SkipToNext,
//         SkipToPrevious,
//         JumpForward,
//         JumpBackward,
//         SetRating,
//         Like,
//         Dislike,
//         Bookmark
//     }
//     export type ResourceObject = number;
//     export interface MetadataOptions {
//         ratingType?: RatingType;
//         forwardJumpInterval?: number;
//         backwardJumpInterval?: number;
//         likeOptions?: FeedbackOptions;
//         dislikeOptions?: FeedbackOptions;
//         bookmarkOptions?: FeedbackOptions;
//         stopWithApp?: boolean;
//         capabilities?: Capability[];
//         notificationCapabilities?: Capability[];
//         compactCapabilities?: Capability[];
//         icon?: ResourceObject;
//         playIcon?: ResourceObject;
//         pauseIcon?: ResourceObject;
//         stopIcon?: ResourceObject;
//         previousIcon?: ResourceObject;
//         nextIcon?: ResourceObject;
//         rewindIcon?: ResourceObject;
//         forwardIcon?: ResourceObject;
//         color?: number;
//     }
//     export enum Event {
//         PlaybackState = "playback-state",
//         PlaybackError = "playback-error",
//         PlaybackQueueEnded = "playback-queue-ended",
//         PlaybackTrackChanged = "playback-track-changed",
//         PlaybackMetadataReceived = "playback-metadata-received",
//         RemotePlay = "remote-play",
//         RemotePlayId = "remote-play-id",
//         RemotePlaySearch = "remote-play-search",
//         RemotePause = "remote-pause",
//         RemoteStop = "remote-stop",
//         RemoteSkip = "remote-skip",
//         RemoteNext = "remote-next",
//         RemotePrevious = "remote-previous",
//         RemoteJumpForward = "remote-jump-forward",
//         RemoteJumpBackward = "remote-jump-backward",
//         RemoteSeek = "remote-seek",
//         RemoteSetRating = "remote-set-rating",
//         RemoteDuck = "remote-duck",
//         RemoteLike = "remote-like",
//         RemoteDislike = "remote-dislike",
//         RemoteBookmark = "remote-bookmark"
//     }
//     export enum TrackType {
//         Default = "default",
//         Dash = "dash",
//         HLS = "hls",
//         SmoothStreaming = "smoothstreaming"
//     }
//     export enum RepeatMode {
//         Off,
//         Track,
//         Queue
//     }
//     export enum PitchAlgorithm {
//         Linear,
//         Music,
//         Voice
//     }
//     export enum State {
//         None,
//         Ready,
//         Playing,
//         Paused,
//         Stopped,
//         Buffering,
//         Connecting
//     }
//     export interface TrackMetadataBase {
//         title?: string;
//         album?: string;
//         artist?: string;
//         duration?: number;
//         artwork?: string | ResourceObject;
//         description?: string;
//         genre?: string;
//         date?: string;
//         rating?: number | boolean;
//     }
//     export interface NowPlayingMetadata extends TrackMetadataBase {
//         elapsedTime?: number;
//     }
//     export interface Track extends TrackMetadataBase {
//         url: string | ResourceObject;
//         type?: TrackType;
//         userAgent?: string;
//         contentType?: string;
//         pitchAlgorithm?: PitchAlgorithm;
//         [key: string]: any;
//     }


//     /** Get current playback state and subsequent updatates  */
//     export const usePlaybackState: () => State;
//     export type Handler = (payload: {
//         type: Event;
//         [key: string]: any;
//     }) => void;
//     /**
//      * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
//      * @param events - TrackPlayer events to subscribe to
//      * @param handler - callback invoked when the event fires
//      */
//     export const useTrackPlayerEvents: (events: Event[], handler: Handler) => void;
//     /**
//      * Poll for track progress for the given interval (in miliseconds)
//      * @param interval - ms interval
//      */
//     export function useProgress(updateInterval?: number): {
//         position: number;
//         duration: number;
//         buffered: number;
//     };

    
//     function setupPlayer(options?: PlayerOptions): Promise<void>;
//     function destroy(): any;
//     type ServiceHandler = () => Promise<void>;
//     function registerPlaybackService(factory: () => ServiceHandler): void;
//     function addEventListener(event: Event, listener: (data: any) => void): import("react-native").EmitterSubscription;
//     function add(tracks: Track | Track[], insertBeforeIndex?: number): Promise<void>;
//     function remove(tracks: number | number[]): Promise<void>;
//     function removeUpcomingTracks(): Promise<void>;
//     function skip(trackIndex: number): Promise<void>;
//     function skipToNext(): Promise<void>;
//     function skipToPrevious(): Promise<void>;
//     function updateOptions(options?: MetadataOptions): Promise<void>;
//     function updateMetadataForTrack(trackIndex: number, metadata: TrackMetadataBase): Promise<void>;
//     function clearNowPlayingMetadata(): Promise<void>;
//     function updateNowPlayingMetadata(metadata: NowPlayingMetadata): Promise<void>;
//     function reset(): Promise<void>;
//     function play(): Promise<void>;
//     function pause(): Promise<void>;
//     function stop(): Promise<void>;
//     function seekTo(position: number): Promise<void>;
//     function setVolume(level: number): Promise<void>;
//     function setRate(rate: number): Promise<void>;
//     function setRepeatMode(mode: RepeatMode): Promise<RepeatMode>;
//     function getVolume(): Promise<number>;
//     function getRate(): Promise<number>;
//     function getTrack(trackIndex: number): Promise<Track>;
//     function getQueue(): Promise<Track[]>;
//     function getCurrentTrack(): Promise<number>;
//     function getDuration(): Promise<number>;
//     function getBufferedPosition(): Promise<number>;
//     function getPosition(): Promise<number>;
//     function getState(): Promise<State>;
//     function getRepeatMode(): Promise<RepeatMode>;
//     const _default: {
//         setupPlayer: typeof setupPlayer;
//         destroy: typeof destroy;
//         registerPlaybackService: typeof registerPlaybackService;
//         addEventListener: typeof addEventListener;
//         add: typeof add;
//         remove: typeof remove;
//         removeUpcomingTracks: typeof removeUpcomingTracks;
//         skip: typeof skip;
//         skipToNext: typeof skipToNext;
//         skipToPrevious: typeof skipToPrevious;
//         updateOptions: typeof updateOptions;
//         updateMetadataForTrack: typeof updateMetadataForTrack;
//         clearNowPlayingMetadata: typeof clearNowPlayingMetadata;
//         updateNowPlayingMetadata: typeof updateNowPlayingMetadata;
//         reset: typeof reset;
//         play: typeof play;
//         pause: typeof pause;
//         stop: typeof stop;
//         seekTo: typeof seekTo;
//         setVolume: typeof setVolume;
//         setRate: typeof setRate;
//         setRepeatMode: typeof setRepeatMode;
//         getVolume: typeof getVolume;
//         getRate: typeof getRate;
//         getTrack: typeof getTrack;
//         getQueue: typeof getQueue;
//         getCurrentTrack: typeof getCurrentTrack;
//         getDuration: typeof getDuration;
//         getBufferedPosition: typeof getBufferedPosition;
//         getPosition: typeof getPosition;
//         getState: typeof getState;
//         getRepeatMode: typeof getRepeatMode;
//     };
//     export default _default;
//     // export hooks.usePlaybackState;
//     // export hooks.useProgress;
//     // export hooks.useTrackPlayerEvents
// }