import { createStackNavigator } from '@react-navigation/stack';

const YtmsNavigator = createStackNavigator<YtmsNavigationParamList>();

export default YtmsNavigator;

export interface YtmsNavigationParamList extends Record<string, object | undefined> {
    Home: undefined;
    ArtistList: undefined;
    AlbumList: { artistId: string };
    TrackList: { artistId: string, albumId?: string };
}