import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../Color'
import axios from 'axios'

import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from "react-redux";
import { addGetImages, clearListImages } from '../redux/reducers/GetImagesReducer'

const { width, height } = Dimensions.get('window')

interface props {
    services: any,
    userID: string
}

const ServicesCardAll: React.FC<props> = ({ services, userID }) => {
    const navigation = useNavigation()

    const dispatch = useDispatch()

    const [uri, setUri] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(true)

    const getImage = async () => {
        try {
            const response = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-image-by-id?id=${services.images[0]}`)
            setUri(response.data.image[0].secureUrl)
            setLoading(false)
        } catch (error) {
            console.log('Err: ', error)
        }
    }

    const handleDetail = async () => {
        dispatch(clearListImages());

        // Tạo mảng promises để chứa các promise tải hình ảnh
        const imagePromises = services.images.map(async element => {
            const response = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-image-by-id?id=${element}`);
            dispatch(addGetImages(response.data.image[0]));
        });

        // Chờ tất cả các promise hoàn thành
        await Promise.all(imagePromises);

        // Sau khi tất cả các hình ảnh đã được tải xuống, điều hướng đến trang WeddingDressDetail
        navigation.navigate('ServicesDetail', { services: services, userID: userID });
    };

    React.useEffect(() => {
        getImage()
    }, [])

    return (
        <TouchableOpacity onPress={handleDetail} style={styles.container}>
            {loading && <View style={styles.loading}>
                <ActivityIndicator size='small' color={Color.deepPink} />
            </View>}
            {!loading && <Image source={{ uri: uri }} style={styles.image} />}
            <View style={styles.contentContainer}>
                <Text style={styles.nameText}>{services.serviceName}</Text>
                <View>
                    <Text style={styles.priceText}>Giá: {services.servicePrice}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ServicesCardAll

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: width - 10,
        height: 180,
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
        width: 160,
        height: 180,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        resizeMode: 'cover',
        marginRight: 5
    },
    loading: {
        width: 140,
        height: 180,
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
    nameText: {
        fontSize: 17,
        color: Color.deepPink,
        fontWeight: 'bold'
    },
    priceText: {
        fontSize: 13,
        color: Color.purpleA100
    }
})