import { createStackNavigator } from '@react-navigation/stack';

const YtmsNavigator = createStackNavigator<YtmsNavigationParamList>();

export default YtmsNavigator;

export interface YtmsNavigationParamList extends Record<string, object | undefined> {
    Home: undefined;
    ArtistList: undefined;
    AlbumList: { artistId: string };
    PlaylistList: undefined;
    // TrackList: { artistId: string, albumId?: string, playlistId?: string };
    TrackList: { artistId: string, albumId?: string, playlistId?: undefined } | { artistId?: undefined, albumId?: undefined, playlistId: string };

    AlbumEditor: { albumId: string };
    ArtistEditor: { artistId: string };
    TrackEditor: { trackId: string };
    PlaylistEditor: { playlistId: string };

    TrackOrgArtistList: { trackId: string, artistId: string, albumId: string };
    TrackOrgAlbumList: { trackId: string, artistId: string, albumId?: string };

    PlaylistAddTrack: { playlistId: string };
    PlaylistArtistList: { playlistId: string };
    PlaylistAlbumList: { playlistId: string, artistId?: string };
    PlaylistTrackList: { playlistId: string, artistId?: string, albumId?: string };
}