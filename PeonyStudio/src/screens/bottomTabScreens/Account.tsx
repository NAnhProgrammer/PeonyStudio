import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Color from '../../Color';

const Account: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute();

  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState<Boolean>(true)

  React.useEffect(() => {
    const { user } = route.params as { user: string };
    setUser(user)
    setLoading(false)
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: Color.white }}>
      {
        loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Color.deepPink} />
        </View>
      }
      {!loading && <TouchableOpacity style={[styles.button, {
        paddingVertical: 30,
        backgroundColor: Color.pink300
      }]}
        onPress={() => navigation.navigate('Profile', { user: user })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: user.avatar }} style={{ borderRadius: 10, marginRight: 10, width: 90, height: 90 }} />
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: Color.white }}>{user.lastName + ' ' + user.firstName}</Text>
            <Text style={{ fontSize: 16, color: Color.white, marginTop: 10 }}>{user.email}</Text>
          </View>
        </View>
        <Entypo name='chevron-thin-right' color={Color.white} size={20} />
      </TouchableOpacity>}

      <TouchableOpacity
        // onPress={() => navigation.navigate('MyProfile')}
        style={[styles.button,
        {
          backgroundColor: Color.pink300,
        }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <AntDesign name='CodeSandbox' color={Color.white} size={30} />
          <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Mục đã xem</Text>
        </View>
        <Entypo name='chevron-thin-right' color={Color.white} size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => navigation.navigate('DeviceInFormation')}
        style={[styles.button,
        {
          backgroundColor: Color.pink300,
        }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Entypo name='clipboard' color={Color.white} size={30} />
          <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Dịch vụ</Text>
        </View>
        <Entypo name='chevron-thin-right' color={Color.white} size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Setting', { user: user })}
        style={[styles.button,
        {
          backgroundColor: Color.pink300,
        }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AntDesign name='setting' color={Color.white} size={30} />
          <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Cài đặt</Text>
        </View>
        <Entypo name='chevron-thin-right' color={Color.white} size={20} />
      </TouchableOpacity>

    </View>
  )
}

export default Account

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 15,
    borderColor: '#ccc'
  }
})