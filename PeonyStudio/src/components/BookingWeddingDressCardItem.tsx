import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../Color'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { changeStatusBookWeddingDressRentalAPI } from '../redux/actions/BookWeddingDressRentalAction'
import CustomButton from './CustomButton'
import FormatDateTime from '../functions/FormatDateTime'
import NotifyModal from './NotifyModal'

interface props {
    BookWeddingDressRental: any
}

const { width, height } = Dimensions.get('window')

const BookingWeddingDressCardItem: React.FC<props> = ({ BookWeddingDressRental }) => {
    const dispatch = useDispatch()
    const [uri, setUri] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(true)
    const [weddingDressName, setWeddingDressName] = React.useState<string>('')
    const [status, setStatus] = React.useState<string>()

    const [confirmModal, setConfirmModal] = React.useState<boolean>(false)
    const [notify, setNotify] = React.useState<boolean>(false)
    const [message, setMessage] = React.useState<string>('')

    const getImage = async () => {
        try {
            const getWeddingDress = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id?id=${BookWeddingDressRental.id_WeddingDress}`)
            const response = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-image-by-id?id=${getWeddingDress.data[0].images[0]}`)
            setUri(response.data.image[0].secureUrl)
            setWeddingDressName(getWeddingDress.data[0].name)

            setLoading(false)
        } catch (error) {
            console.log('Err: ', error)
        }
    }

    React.useEffect(() => {
        getImage()
        if (BookWeddingDressRental.status === 0) {
            setStatus('Chờ xác nhận')
        } else if (BookWeddingDressRental.status === 1) {
            setStatus('Đã xác nhận')
        } else if (BookWeddingDressRental.status === 2) {
            setStatus('Đã xếp lịch')
        }
    }, [])

    const handleConfirm = () => {
        const newUpdate = { ...BookWeddingDressRental }
        newUpdate.status = 3

        try {
            dispatch(changeStatusBookWeddingDressRentalAPI(newUpdate))
            setMessage('Hủy đặt áo cưới thành công')
            setNotify(true)
        } catch (error) {
            setMessage('Đã xảy ra lỗi')
            setNotify(true)
        }
    }

    const handleCancelBooking = () => {
        setConfirmModal(true)
    }

    return (
        <View style={styles.container}>

            <NotifyModal
                visible={notify}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ padding: 15 }}>
                            <Text style={{ color: Color.deepPink, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}
                            >{message}</Text>

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
                            >Hủy đặt áo cưới này?</Text>

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

            {loading && <View style={styles.loading}>
                <ActivityIndicator size='small' color={Color.deepPink} />
            </View>}
            {!loading && <TouchableOpacity>
                <Image source={{ uri: uri }} style={styles.image} />
            </TouchableOpacity>}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{weddingDressName}</Text>
                <View style={{ justifyContent: 'space-between', flex: 1 }}>
                    <View>
                        <Text style={styles.content}>Thời gian đặt: {FormatDateTime(BookWeddingDressRental.bookingTime)}</Text>
                        {BookWeddingDressRental.acceptTime === '' && <Text style={styles.content}>Thời gian xác nhận: {FormatDateTime(BookWeddingDressRental.acceptTime)}</Text>}
                        {BookWeddingDressRental.appointmentDate === '' && <Text style={styles.content}>Thời gian xác nhận: {FormatDateTime(BookWeddingDressRental.appointmentDate)}</Text>}
                        <Text style={styles.content}>Trạng thái: {status}</Text>
                    </View>
                    {BookWeddingDressRental.status === 0 && <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <CustomButton
                            onPress={() => handleCancelBooking()}
                            title='Hủy đặt'
                            titleStyle={{ color: Color.white, fontSize: 16, fontWeight: 'bold' }}
                            viewStyle={{ margin: 3, width: 100, paddingVertical: 4, borderRadius: 10, backgroundColor: Color.deepPink, justifyContent: 'center', alignItems: 'center' }} />
                    </View>}
                </View>
            </View>
        </View>
    )
}

export default BookingWeddingDressCardItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: width - 10,
        height: 170,
        margin: 5,
        flex: 1,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: Color.pink100,
        backgroundColor: Color.white,
        shadowColor: Color.blackOpacity50,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    image: {
        width: 115,
        height: 170,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        resizeMode: 'cover',
        marginRight: 5
    },
    loading: {
        width: 115,
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    contentContainer: {
        flexDirection: 'column',
        padding: 2,
        flex: 1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    title: {
        fontSize: 19,
        color: Color.deepPink,
        fontWeight: 'bold'
    },
    content: {
        fontSize: 14,
        color: Color.purpleA100
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