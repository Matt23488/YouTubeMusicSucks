import { NavigationContainer, RouteProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import Permissions from 'react-native-permissions';
import YtmsNavigator, { YtmsNavigationParamList } from './screens/YtmsNavigator';
import HomeScreen from './screens/HomeScreen';
import MusicPlayer from './components/MusicPlayer';
import AlbumList from './screens/AlbumList';
import { useMusic } from './utilities/storage';
import ArtistList from './screens/ArtistList';
import TrackList from './screens/TrackList';
import AlbumEditor from './screens/AlbumEditor';

const App = () => {
  const [state, setState] = useState({ loaded: false, error: false });
  const { artists, albums, tracks } = useMusic();

  useEffect(() => {
    Permissions.request(Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
      const error = result !== Permissions.RESULTS.GRANTED;
      setState({ loaded: true, error });
    }).catch(e => {
      console.log(e);
      setState({ loaded: true, error: true });
    });
  }, []);

  const buildAlbumListOptions = ({route}: { route: RouteProp<YtmsNavigationParamList, 'AlbumList'> }) => {
    const artist = artists.find(a => a.artistId === route.params.artistId)?.name;
    return ({
      title: artist ?? 'All Albums'
    });
  }

  const buildTrackListOptions = ({route}: { route: RouteProp<YtmsNavigationParamList, 'TrackList'> }) => {    
    const artist = artists.find(a => a.artistId === route.params.artistId)?.name;
    const album = albums.find(a => a.albumId === route.params.albumId)?.name;
    const title = artist ? `${artist} - ${album ?? 'All Tracks'}` : 'All Tracks';

    return { title };
  }

  if (!state.loaded) return <Text>Loading...</Text>;
  if (state.error) return <Text>:(</Text>;

  return (
    <NavigationContainer>
      <YtmsNavigator.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#9f00ff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            color: '#fff',
          },
        }}
      >
        <YtmsNavigator.Screen name="Home" component={HomeScreen} options={{ title: 'YouTube Music Sucks!' }} />
        <YtmsNavigator.Screen name="ArtistList" component={ArtistList} options={{ title: 'All Artists' }} />
        <YtmsNavigator.Screen name="AlbumList" component={AlbumList} options={buildAlbumListOptions} />
        <YtmsNavigator.Screen name="TrackList" component={TrackList} options={buildTrackListOptions} />
        <YtmsNavigator.Screen name="AlbumEditor" component={AlbumEditor} options={{ title: 'Album Search' }} />
      </YtmsNavigator.Navigator>
      <MusicPlayer />
    </NavigationContainer>
  );
};

export default App;

// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * Generated with the TypeScript template
//  * https://github.com/react-native-community/react-native-template-typescript
//  *
//  * @format
//  */

//  import React from 'react';
//  import {
//    SafeAreaView,
//    ScrollView,
//    StatusBar,
//    StyleSheet,
//    Text,
//    useColorScheme,
//    View,
//  } from 'react-native';

//  import {
//    Colors,
//    DebugInstructions,
//    Header,
//    LearnMoreLinks,
//    ReloadInstructions,
//  } from 'react-native/Libraries/NewAppScreen';

//  import Icon from 'react-native-vector-icons/FontAwesome5';

//  const Section: React.FC<{
//    title: string;
//  }> = ({children, title}) => {
//    const isDarkMode = useColorScheme() === 'dark';
//    return (
//      <View style={styles.sectionContainer}>
//        <Text
//          style={[
//            styles.sectionTitle,
//            {
//              color: isDarkMode ? Colors.white : Colors.black,
//            },
//          ]}>
//          {title}
//        </Text>
//        <Text
//          style={[
//            styles.sectionDescription,
//            {
//              color: isDarkMode ? Colors.light : Colors.dark,
//            },
//          ]}>
//          {children}
//        </Text>
//      </View>
//    );
//  };

//  const App = () => {
//    const isDarkMode = useColorScheme() === 'dark';

//    const backgroundStyle = {
//      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//    };

//    return (
//      <SafeAreaView style={backgroundStyle}>
//        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//        <ScrollView
//          contentInsetAdjustmentBehavior="automatic"
//          style={backgroundStyle}>
//          <Header />
//          <View
//            style={{
//              backgroundColor: isDarkMode ? Colors.black : Colors.white,
//            }}>
//            <Section title="Step One">
//              <Icon name="step-forward" size={24} color="black" />
//              Edit <Text style={styles.highlight}>App.js</Text> to change this
//              screen and then come back to see your edits.
//            </Section>
//            <Section title="See Your Changes">
//              <ReloadInstructions />
//            </Section>
//            <Section title="Debug">
//              <DebugInstructions />
//            </Section>
//            <Section title="Learn More">
//              Read the docs to discover what to do next:
//            </Section>
//            <LearnMoreLinks />
//          </View>
//        </ScrollView>
//      </SafeAreaView>
//    );
//  };

//  const styles = StyleSheet.create({
//    sectionContainer: {
//      marginTop: 32,
//      paddingHorizontal: 24,
//    },
//    sectionTitle: {
//      fontSize: 24,
//      fontWeight: '600',
//    },
//    sectionDescription: {
//      marginTop: 8,
//      fontSize: 18,
//      fontWeight: '400',
//    },
//    highlight: {
//      fontWeight: '700',
//    },
//  });

//  export default App;
