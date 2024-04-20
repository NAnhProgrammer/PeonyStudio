import { View, Text, Dimensions, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import Swiper from 'react-native-swiper'

import Entypo from 'react-native-vector-icons/Entypo'
import Color from '../../Color'

const { width, height } = Dimensions.get('window')

import { useNavigation } from '@react-navigation/native'

const Welcome: React.FC = () => {
  const navigation = useNavigation()

  const handleNext = () => {
    navigation.navigate('Start')
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'edwardianscriptitc', fontSize: 55, color: Color.deepPink }}>
        PeonyStudio
      </Text>
      <View style={styles.itemContainer}>
        <Swiper
          showsButtons={false}
          dotColor='#ccc'
          dotStyle={{ width: 20, height: 4 }}
          activeDotStyle={{ width: 20, height: 4 }}
          activeDotColor={Color.deepPink}
          style={{ borderRadius: 5 }}
          horizontal={true}
        >
          <Image style={styles.image} source={require('../../images/Welcome1.jpg')} />
          <Image style={styles.image} source={require('../../images/Welcome2.png')} />
          <Image style={styles.image} source={require('../../images/Welcome3.jpg')} />
        </Swiper>
      </View>
      <TouchableOpacity
        onPress={ handleNext}
        style={{ height: 50, width: 50, backgroundColor: Color.deepPink, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}
      >
        <Entypo name='chevron-thin-right' color='#fff' size={25} />
      </TouchableOpacity>
    </View>
  );

}

export default Welcome

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    marginVertical: 10,
    height: height * 0.6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  }
})