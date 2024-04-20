import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../Color'
import axios from 'axios'

import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from "react-redux";
import { addGetImages, clearListImages } from '../redux/reducers/GetImagesReducer'

interface props {
  services: any,
  userID: string
}

const ServicesCardItem: React.FC<props> = ({ services, userID }) => {
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
    <View style={styles.container}>
      {loading && <View style={styles.loading}>
        <ActivityIndicator size='small' color={Color.deepPink} />
      </View>}
      {!loading && <TouchableOpacity onPress={handleDetail}>
        <Image source={{ uri: uri }} style={styles.image} />
      </TouchableOpacity>}
      <View style={styles.contentContainer}>
        <Text style={styles.nameText}>{services.serviceName}</Text>
        <View>
          <Text style={styles.priceText}>Giá: {services.servicePrice}</Text>
        </View>
      </View>
    </View>
  )
}

export default ServicesCardItem

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 240,
    margin: 5,
    flex: 1
  },
  image: {
    width: 150,
    height: 175,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  loading: {
    width: 150,
    height: 175,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flexDirection: 'column',
    padding: 3,
    justifyContent: 'space-between',
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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