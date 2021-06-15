declare module '@yajanarao/react-native-get-music-files' {
    const RNAndroidAudioStore: {
        getSongs: (options?: {
            artist?: string,
            album?: string,
        }) => Promise<Array<RngmfTrack>>,
    };

    interface RngmfTrack {
        id: string;
        songUri: string;
        title: string;
        artist: string;
        album: string;
        duration: string;
        path: string;
    }

    export default RNAndroidAudioStore;
}