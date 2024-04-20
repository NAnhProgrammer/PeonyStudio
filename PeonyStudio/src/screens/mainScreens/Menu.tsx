import React from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LocalData from '../../LocalData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notification from '../bottomTabScreens/Notification';
import Chat from '../bottomTabScreens/Chat';
import Booking from '../bottomTabScreens/Booking';
import Home from '../bottomTabScreens/Home';
import Account from '../bottomTabScreens/Account';
import Color from '../../Color';
import { useDispatch } from 'react-redux';
import { getBookWeddingDressRental } from '../../redux/actions/BookWeddingDressRentalAction';
import { getBookServiceAppointment } from '../../redux/actions/BookServiceAppointmentAction';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

type MenuParamList = {
  Menu: { user: any };
  Home: undefined;
  Booking: undefined;
  Chat: undefined;
  Notification: undefined;
  Account: undefined;
};

type MenuProps = BottomTabScreenProps<MenuParamList, 'Menu'>;

const Tab = createBottomTabNavigator();

const Menu: React.FC<MenuProps> = () => {

  const dispatch = useDispatch()
  const route = useRoute()

  const [user, setUser] = React.useState<Object | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const checkUserData = async () => {
    try {
      const valueUser = await AsyncStorage.getItem('user')
      if (valueUser !== null) {
        const ret = await LocalData.load({
          key: 'user',
          autoSync: true,
          syncInBackground: true,
          syncParams: {
            extraFetchOptions: {
              // blahblah
            },
            someFlag: true
          }
        });
        setUser(ret.user)
      } else {
        setUser(route.params.user)
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false); // Kết thúc quá trình tải dữ liệu
    }
  };

  React.useEffect(() => {
    checkUserData();
  }, []);

  if (isLoading) {
    // Hiển thị nội dung tải lên khi dữ liệu đang được tải
    return (
      <View style={{
        flex: 1,
        backgroundColor: Color.whiteOpacity30,
        width,
        height,
        justifyContent: 'center',
        padding: 20
      }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={Color.deepPink} />
        </View>
      </View>
    );
  }

  if (!user) {
    return null; // Trả về null nếu không có tài khoản
  }

  dispatch(getBookWeddingDressRental({ id_user: user.id }))
  dispatch(getBookServiceAppointment({ id_user: user.id }))

  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Color.white,
        tabBarInactiveTintColor: Color.white,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Color.deepPink,
          position: 'absolute',
          margin: 7,
          borderRadius: 10,
          paddingHorizontal: 3,
        },
        tabBarIcon: ({ focused, color, size }) => {

          if (focused) {
            if (route.name === 'Home') {
              return <Ionicons name='home' size={size} color={color} />;
            } else if (route.name === 'Booking') {
              return <Ionicons name='calendar' size={size} color={color} />;
            } else if (route.name === 'Chat') {
              return <Ionicons name='chatbox' size={size} color={color} />
            } else if (route.name === 'Account') {
              return <FontAwesome name='user' size={size} color={color} />;
            }
          } else {
            if (route.name === 'Home') {
              return <Ionicons name='home-outline' size={size} color={color} />;
            } else if (route.name === 'Booking') {
              return <Ionicons name='calendar-clear-outline' size={size} color={color} />;
            } else if (route.name === 'Chat') {
              return <Ionicons name='chatbox-outline' size={size} color={color} />
            } else if (route.name === 'Account') {
              return <FontAwesome name='user-o' size={size} color={color} />;
            }
          }

        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Booking"
        component={Booking}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        initialParams={{ user }}
      />
    </Tab.Navigator>

  );
}

export default Menu;
