import { createStackNavigator } from '@react-navigation/stack';

const YtmsNavigator = createStackNavigator<YtmsNavigationParamList>();

export default YtmsNavigator;

export interface YtmsNavigationParamList extends Record<string, object | undefined> {
    Home: undefined;
    ArtistList: undefined;
    AlbumList: { artistId: string };
    TrackList: { artistId: string, albumId?: string, playlistId?: string };
    AlbumEditor: { albumId: string };
    ArtistEditor: { artistId: string };
    TrackEditor: { trackId: string };
}