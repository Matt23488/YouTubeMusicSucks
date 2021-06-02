/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import App from './Example';
import {name as appName} from './app.json';
//import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);
// TrackPlayer.registerPlaybackService(() => require('./services/trackPlayerService'));