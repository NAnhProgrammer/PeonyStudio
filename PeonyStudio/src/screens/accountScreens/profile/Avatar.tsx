import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import Color from '../../../Color'
import { useNavigation, useRoute } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const Avatar: React.FC = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {user} = route.params

    return (
        <View style={{ flex: 1, backgroundColor: Color.white }}>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', backgroundColor: Color.deepPink, padding: 10
            }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Entypo name='chevron-thin-left' color={Color.white} size={25} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: Color.white }}>
                    Ảnh
                </Text>
                <TouchableOpacity>
                    <Entypo name='dots-three-horizontal' color={Color.white} size={25} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Image source={{ uri: user.avatar }} style={{ width, height: width, resizeMode: 'cover' }} />
            </View>
        </View>
    )
}

export default Avatar