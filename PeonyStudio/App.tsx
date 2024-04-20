import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Start from './src/screens/mainScreens/Start';
import Welcome from './src/screens/mainScreens/Welcome';
import Menu from './src/screens/mainScreens/Menu';

import { Provider } from 'react-redux'
import store from './src/redux/store';
import LocalData from './src/LocalData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from './src/components/LoadingModal';

const Stack = createNativeStackNavigator()

import { useDispatch } from "react-redux";
import { getWeddingDress } from './src/redux/actions/WeddingDressAction'
import { getServices } from './src/redux/actions/ServicesAction';
import { getNews } from './src/redux/actions/NewsAction';
import WeddingDressDetail from './src/screens/details/WeddingDressDetail';
import ServicesDetail from './src/screens/details/ServicesDetail';
import WeddingDressAllList from './src/screens/listsScreen/WeddingDressAllList';
import ServicesAllList from './src/screens/listsScreen/ServicesAllList';
import Properties from './src/screens/accountScreens/profile/Properties';
import Avatar from './src/screens/accountScreens/profile/Avatar';
import Profile from './src/screens/accountScreens/Profile';
import Setting from './src/screens/accountScreens/Setting';
import ChangePassword from './src/screens/accountScreens/setting/ChangePassword';
import ChatRoom from './src/screens/details/ChatRoom';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Body />
    </Provider>
  )
}

const Body = () => {
  const [initialRoute, setInitialRoute] = React.useState<string>('Welcome');
  const [loading, setLoading] = React.useState<boolean>(true)

  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getWeddingDress())
    dispatch(getServices())
    dispatch(getNews())
  }, [dispatch])

  const checkRemember = async () => {
    try {
      const valueRemember = await AsyncStorage.getItem('remember')
      if (valueRemember !== null) {
        const ret = await LocalData.load({
          key: 'remember',
          autoSync: true,
          syncInBackground: true,
          syncParams: {
            extraFetchOptions: {

            }, someFlag: true
          }
        })
        if (ret.remember) {
          setInitialRoute('Menu')
          console.log('true')
        } else {
          setInitialRoute('Start')
          console.log('false')
        }
      } else {
        LocalData.save({
          key: 'remember',
          data: {
            remember: false
          }
        })
      }
    } catch (error) {
      console.warn(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    checkRemember()
  }, [])

  if (loading) {
    return <LoadingModal visible={loading} />
  }

  return (

    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Welcome' component={Welcome} />
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Menu' component={Menu} />
        <Stack.Screen name='WeddingDressDetail' component={WeddingDressDetail} />
        <Stack.Screen name='ServicesDetail' component={ServicesDetail} />
        <Stack.Screen name='WeddingDressAllList' component={WeddingDressAllList} />
        <Stack.Screen name='ServicesAllList' component={ServicesAllList} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='Setting' component={Setting} />
        <Stack.Screen name='Properties' component={Properties} />
        <Stack.Screen name='Avatar' component={Avatar} />
        <Stack.Screen name='ChangePassword' component={ChangePassword} />
        <Stack.Screen name='ChatRoom' component={ChatRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App