import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import Color from '../../Color';
import { useNavigation, useRoute } from '@react-navigation/native'
import LocalData from '../../LocalData';
import CustomButton from '../../components/CustomButton';
import NotifyModal from '../../components/NotifyModal';

const { width, height } = Dimensions.get('window')

const handleSaveLocal = () => {
    LocalData.save({
        key: 'remember',
        data: {
            loginStatus: false
        },
    });
    LocalData.remove({
        key: 'user',
    });
}

const Setting: React.FC = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { user } = route.params

    const [confirmModal, setConfirmModal] = React.useState<boolean>(false)

    const handleLogout = () => {
        setConfirmModal(true)
    }

    const handleConfirm = () => {
        handleSaveLocal()
        navigation.navigate('Start')
    }

    return (
        <View style={{ flex: 1, backgroundColor: Color.white }}>

            <NotifyModal
                visible={confirmModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ padding: 15 }}>
                            <Text style={{ color: Color.deepPink, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}
                            >Xác Nhận</Text>
                            <Text style={{ color: Color.pink300, fontSize: 15, textAlign: 'center', lineHeight: 22, marginVertical: 15 }}
                            >Đăng xuất tài khoản?</Text>

                        </View>
                        <View style={{ marginTop: 15, borderTopColor: Color.purpleA100, borderTopWidth: 0.8, flexDirection: 'row' }}>
                            <CustomButton title='Hủy'
                                onPress={() => {
                                    setConfirmModal(false)
                                }}

                                titleStyle={{ color: Color.purpleA100, fontSize: 15 }}
                                viewStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.4, borderColor: Color.purpleA100, padding: 15 }}
                            />
                            <CustomButton title='Xác nhận'
                                onPress={handleConfirm}
                                titleStyle={{ color: Color.deepPink, fontSize: 15, fontWeight: 'bold' }}
                                viewStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.4, borderColor: Color.purpleA100, padding: 15 }}
                            />
                        </View>
                    </View>
                </View>
            </NotifyModal>

            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', borderBottomWidth: 1, borderColor: Color.white, padding: 10
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Entypo name='chevron-thin-left' color={Color.deepPink} size={25} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: Color.deepPink }}>
                    Cài đặt
                </Text>
                <TouchableOpacity>
                    <Text>{' '}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>

                <TouchableOpacity
                    // onPress={() => navigation.navigate('Properties', { user: user, status: 0 })}
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                        marginBottom: 3
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>Đổi mật khẩu</Text>
                    </View>

                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>More setting</Text>
                    </View>


                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>More setting</Text>
                    </View>


                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button,
                    {
                        backgroundColor: Color.pink300,
                    }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, color: Color.white, marginLeft: 10 }}>More setting</Text>
                    </View>


                    <Entypo name='chevron-thin-right' color={Color.white} size={20} />

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleLogout()}
                    style={[styles.button, { justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: Color.pink300, }]}>
                    <Text style={{ fontSize: 18, color: Color.white, marginLeft: 10 }}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Setting

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 0.5,
        borderColor: Color.white
    }, modalContainer: {
        flex: 1,
        backgroundColor: Color.blackOpacity30,
        width,
        height,
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: Color.white,
        borderRadius: 15,
    }
})