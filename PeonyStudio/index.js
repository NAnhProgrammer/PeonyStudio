/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Welcome from './src/screens/mainScreens/Welcome'
import Start from './src/screens/mainScreens/Start'

AppRegistry.registerComponent(appName, () => App);
