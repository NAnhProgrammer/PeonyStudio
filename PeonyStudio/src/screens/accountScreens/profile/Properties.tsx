import { View, Text, Dimensions, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React from 'react'
import Color from '../../../Color'
import CustomButton from '../../../components/CustomButton';
import NotifyModal from '../../../components/NotifyModal';
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios';
import LocalData from '../../../LocalData';

const { width, height } = Dimensions.get('window')

const handleSaveLocal = (user: any) => {
    LocalData.save({
        key: 'user',
        data: {
            user: user
        }
    })
}

const Properties: React.FC = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { user, status } = route.params

    const [userUpdate, setUserUpdate] = React.useState<any>(null)
    const [title, setTitle] = React.useState<string>('')
    const [content, setContent] = React.useState<string>('')
    const [notify, setNotify] = React.useState<boolean>(false)
    const [textNotify, setTextNotify] = React.useState<string>('')
    const [statusNotify, setStatusNotify] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (status === 0) {
            setTitle('Họ')
            setContent(user.lastName)
        } else if (status === 1) {
            setTitle('Tên')
            setContent(user.firstName)
        } else if (status === 2) {
            setTitle('Số điện thoại')
            setContent(user.phoneNumber)
        } else if (status === 3) {
            setTitle('Địa chỉ')
            setContent(user.address)
        }
    }, [])

    const handleSaveUpdate = async () => {

        if (content === '') {
            setNotify(true)
            setTextNotify('Không có thông tin được nhập.\n Hãy nhập lại')
            return
        }

        const newUpdate = { ...user }

        if (status === 0) {
            newUpdate.lastName = content
        } else if (status === 1) {
            newUpdate.firstName = content
        } else if (status === 2) {
            newUpdate.phoneNumber = content
        } else if (status === 3) {
            newUpdate.address = content
        }

        try {
            const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-user', newUpdate)
            if (response.status === 200) {
                handleSaveLocal(newUpdate)
                setUserUpdate(newUpdate)
                setTextNotify('Cập nhật thông tin thành công. \n Thông tin cập nhật sẽ hiển thị sau khi khởi động lại')
                setStatusNotify(true)
                setNotify(true)
            } else {
                setTextNotify('Cập nhật thông tin không thành công')
                setStatusNotify(false)
                setNotify(true)
            }
        } catch (error) {
            console.log('Err: ', error)
        }
    }

    const handleSubmit = () => {
        if (statusNotify === true) {
            setNotify(false)
            navigation.goBack()
        } else {
            setNotify(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: Color.white }}>

            <NotifyModal
                visible={notify}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ padding: 15 }}>
                            <Text style={{ color: Color.pink300, fontSize: 17, textAlign: 'center', lineHeight: 22, marginVertical: 15 }}
                            >{textNotify}</Text>

                        </View>
                        <View style={{ marginTop: 15, borderTopColor: Color.purpleA100, borderTopWidth: 0.8, flexDirection: 'row' }}>
                            <CustomButton title='Đóng'
                                onPress={() => {
                                    handleSubmit()
                                }}
                                titleStyle={{ color: Color.purpleA100, fontSize: 15 }}
                                viewStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.4, borderColor: Color.purpleA100, padding: 15 }}
                            />
                        </View>
                    </View>
                </View>
            </NotifyModal>

            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', backgroundColor: Color.deepPink, padding: 10
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ fontSize: 18, color: Color.white, fontWeight: 'bold' }}>Hủy</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: Color.white }}>
                    {title}
                </Text>
                <TouchableOpacity onPress={() => handleSaveUpdate()}>
                    <Text style={{ fontSize: 18, color: Color.white, fontWeight: 'bold' }}>Lưu</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: width, borderBottomColor: Color.pink300, borderBottomWidth: 1, paddingHorizontal: 5 }}>
                <TextInput
                    value={content}
                    onChangeText={text => setContent(text)}
                    selectionColor={Color.deepPink}
                    style={{ fontSize: 18, color: Color.deepPink }} />
            </View>
        </View>
    )
}

export default Properties

const styles = StyleSheet.create({
    modalContainer: {
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