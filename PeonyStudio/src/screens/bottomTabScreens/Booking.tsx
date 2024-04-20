import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Color from '../../Color'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import BookWedding from '../materialTopTabScreens/BookWedding'
import BookServices from '../materialTopTabScreens/BookServices'

const { width, height } = Dimensions.get('window')

const Booking: React.FC = () => {
  const Tab = createMaterialTopTabNavigator()


  return (

    <View style={{ flex: 1, backgroundColor: Color.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Color.deepPink,
          tabBarInactiveTintColor: Color.purpleA100,
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: Color.deepPink, height: 2 },
        }}
      >
        <Tab.Screen name="Đặt áo cưới" component={BookWedding} />
        <Tab.Screen name="đặt dịch vụ" component={BookServices} />
      </Tab.Navigator>
    </View>

  )
}

export default Booking

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    flex: 1
  },
})