import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../Color'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

import { useDispatch, useSelector } from "react-redux";
import { addGetImages, clearListImages } from '../redux/reducers/GetImagesReducer'

interface props {
  weddingDress: any,
  userID: string
}

const WeddingDressCardItem: React.FC<props> = ({ weddingDress, userID }) => {

  const navigation = useNavigation()

  const dispatch = useDispatch()

  const [uri, setUri] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(true)

  const getImage = async () => {
    try {
      const response = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-image-by-id?id=${weddingDress.images[0]}`)
      setUri(response.data.image[0].secureUrl)
      setLoading(false)
    } catch (error) {
      console.log('Err: ', error)
    }
  }

  const handleDetail = async () => {
    dispatch(clearListImages());
  
    // Tạo mảng promises để chứa các promise tải hình ảnh
    const imagePromises = weddingDress.images.map(async element => {
      const response = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-image-by-id?id=${element}`);
      dispatch(addGetImages(response.data.image[0]));
    });
  
    // Chờ tất cả các promise hoàn thành
    await Promise.all(imagePromises);
  
    // Sau khi tất cả các hình ảnh đã được tải xuống, điều hướng đến trang WeddingDressDetail
    navigation.navigate('WeddingDressDetail', { weddingDress: weddingDress, userID: userID });
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
        <Text style={styles.nameText}>{weddingDress.name}</Text>
        <View>
          <Text style={styles.priceText}>Giá bán: {weddingDress.purchasePrice}</Text>
          <Text style={styles.priceText}>Giá thuê: {weddingDress.rentalCost}</Text>
        </View>
      </View>
    </View>
  )
}

export default WeddingDressCardItem

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 260,
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