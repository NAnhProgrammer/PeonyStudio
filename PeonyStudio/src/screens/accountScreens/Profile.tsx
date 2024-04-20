import { View, Text, Dimensions, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import Color from '../../Color';
import { useNavigation, useRoute } from '@react-navigation/native'

const Profile: React.FC = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { user } = route.params

    return (
        <View style={{ flex: 1, backgroundColor: Color.white }}>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', borderBottomWidth: 1, borderColor: Color.white, padding: 10
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Entypo name='chevron-thin-left' color={Color.deepPink} size={25} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: Color.deepPink }}>
                    Hồ sơ cá nhân
                </Text>
                <TouchableOpacity>
                    <Text>{' '}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Avatar', { user: user })}
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                        marginBottom: 3
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Ảnh đại diện</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={{ uri: user.avatar }}
                            style={{ width: 70, height: 70, resizeMode: 'cover', borderRadius: 10 }} />
                        <Entypo name='chevron-thin-right' color={Color.white} size={20} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Properties', { user: user, status: 0 })}
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Họ</Text>
                    </View>

                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Properties', { user: user, status: 1 })}
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Tên</Text>
                    </View>


                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Properties', { user: user, status: 2 })}
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Số điện thoại</Text>
                    </View>

                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Properties', { user: user, status: 3 })}
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Địa chỉ</Text>
                    </View>

                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 0.5,
        borderColor: Color.white
    }
})