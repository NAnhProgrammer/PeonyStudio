import { ActivityIndicator, Dimensions, ImageBackground, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../../Color'

import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'

import { useNavigation, useRoute } from '@react-navigation/native'

import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../redux/store'

import CustomButton from '../../components/CustomButton'
import NotifyModal from '../../components/NotifyModal'
import LoadingModal from '../../components/LoadingModal'
import { addBookWeddingDressRentalAPI } from '../../redux/actions/BookWeddingDressRentalAction'
import GenerateRandomId from '../../functions/GenerateRandomId'
import axios from 'axios'

const { width, height } = Dimensions.get('window')

const WeddingDressDetail: React.FC = () => {
    const dispatch = useDispatch()

    const navigation = useNavigation()
    const route = useRoute()
    const { weddingDress, userID } = route.params

    const ListImages = useSelector((state: RootState) => state.GetImagesStore.ListImages)

    const [uri, setUri] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(true)

    const [confirmModal, setConfirmModal] = React.useState<boolean>(false)
    const [notify, setNotify] = React.useState<boolean>(false)
    const [loadingVisible, setLoadingVisible] = React.useState<boolean>(false)

    const [notifyText, setNotifyText] = React.useState<string>('')

    React.useEffect(() => {
        setUri(ListImages[0].secureUrl)
        setLoading(false)
    }, [])

    if (loading) {
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

    const handleConfirm = async () => {
        setLoadingVisible(true)
        setConfirmModal(false)

        const check = await axios.post("https://mobile-react-native-workshop-server.onrender.com/find-book-wedding-dress-rental-by-id-user-and-id-wedding-dress", {
            id_user: userID,
            id_weddingDress: weddingDress.id
        });

        if (check.status === 200) {
            if (check.data.status === 3) {
                const book = {
                    id: GenerateRandomId('BW'),
                    bookingTime: new Date().toLocaleString(),
                    acceptTime: '',
                    id_User: userID,
                    id_WeddingDress: weddingDress.id,
                    appointmentDate: '',
                    status: 0
                }
                dispatch(addBookWeddingDressRentalAPI(book))
                setNotifyText('Đặt lịch thuê áo cưới thành công')
            } else {
                setNotifyText('Áo cưới đang được đặt')
            }
        } else {
            const book = {
                id: GenerateRandomId('BW'),
                bookingTime: new Date().toLocaleString(),
                acceptTime: '',
                id_User: userID,
                id_WeddingDress: weddingDress.id,
                appointmentDate: '',
                status: 0
            }

            dispatch(addBookWeddingDressRentalAPI(book))
            setNotifyText('Đặt lịch thuê áo cưới thành công')
        }

        setLoadingVisible(false)
        setNotify(true)
    }


    return (
        <View style={styles.container}>

            <LoadingModal visible={loadingVisible} />

            <NotifyModal
                visible={notify}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ padding: 15 }}>
                            <Text style={{ color: Color.deepPink, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}
                            >{notifyText}</Text>

                        </View>
                        <View style={{ marginTop: 15, borderTopColor: Color.purpleA100, borderTopWidth: 0.8 }}>
                            <CustomButton title='Đóng'
                                onPress={() => {
                                    setNotify(false)
                                }}
                                titleStyle={{ color: Color.deepPink, fontSize: 15, fontWeight: 'bold' }}
                                viewStyle={{ justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.4, borderColor: Color.purpleA100, padding: 15 }}
                            />
                        </View>
                    </View>
                </View>
            </NotifyModal>

            <NotifyModal
                visible={confirmModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ padding: 15 }}>
                            <Text style={{ color: Color.deepPink, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}
                            >Xác Nhận</Text>
                            <Text style={{ color: Color.pink300, fontSize: 15, textAlign: 'center', lineHeight: 22, marginVertical: 15 }}
                            >Đặt lịch thuê áo cưới này</Text>

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

            <ImageBackground source={{ uri: uri }} style={{ width, height: height * 0.58 }}>
                <View style={{ margin: 5, flexDirection: 'row', alignContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='leftcircle' color={Color.pink300} size={40} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <View style={{ margin: 5, flex: 1 }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ flexDirection: 'row' }}>
                        {ListImages.map(item => (
                            <View style={{ marginRight: 5 }} key={item.id}>
                                <TouchableOpacity onPress={() => setUri(item.secureUrl)}>
                                    <Image source={{ uri: item.secureUrl }} style={{ width: 80, height: 95, resizeMode: 'cover' }} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <Text style={{ fontSize: 23, color: Color.deepPink, fontWeight: 'bold', paddingBottom: 2, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: Color.pink300 }}>
                        {weddingDress.name + ' - ' + weddingDress.outstanding}</Text>

                    <Text style={{ fontSize: 17, color: Color.purpleA100, marginTop: 5 }}>
                        Giá bán: {weddingDress.purchasePrice} VNĐ
                    </Text>

                    <Text style={{ fontSize: 17, color: Color.purpleA100 }}>
                        Giá thuê: {weddingDress.rentalCost} VNĐ
                    </Text>

                    <Text style={{ fontSize: 20, color: Color.deepPink, fontWeight: 'bold', marginTop: 5 }}>
                        Mô tả
                    </Text>

                    {weddingDress.describes.map((item, index) => (
                        <View key={index}
                            style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Entypo name='triangle-right' color={Color.deepPink} size={18} />
                            <Text style={{ fontSize: 17, color: Color.purpleA100 }}>{item}</Text>
                        </View>
                    ))}

                </ScrollView>
            </View>

            <CustomButton
                onPress={() => setConfirmModal(true)}
                title='Thuê ngay'
                titleStyle={{ color: Color.white, fontSize: 18, fontWeight: 'bold' }}
                viewStyle={{ margin: 5, paddingVertical: 8, borderRadius: 10, backgroundColor: Color.deepPink, justifyContent: 'center', alignItems: 'center' }} />

        </View>
    )
}

export default WeddingDressDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        justifyContent: 'space-between'
    },
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