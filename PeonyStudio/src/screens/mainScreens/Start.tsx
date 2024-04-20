import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Color from '../../Color'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Login from '../materialTopTabScreens/Login'
import Signup from '../materialTopTabScreens/Signup'

const { width, height } = Dimensions.get('window')

const Start: React.FC = () => {
  const Tab = createMaterialTopTabNavigator()


  return (

    <ImageBackground source={require('../../images/backgroundApp.jpeg')}
      style={{ flex: 1, width, height }}
    >

      <Text style={{ fontFamily: 'edwardianscriptitc', fontSize: 55, color: Color.deepPink, textAlign: 'center' }}>
        PeonyStudio
      </Text>

      <View style={{ flex: 1, marginTop: 250, backgroundColor: Color.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>

        <Tab.Navigator
         screenOptions={{
          tabBarActiveTintColor: Color.deepPink,
          tabBarInactiveTintColor: Color.purpleA100,
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: Color.deepPink, height: 2 },
          tabBarStyle: { borderTopLeftRadius: 30, borderTopRightRadius: 30  },
        }}
        >
          <Tab.Screen name="Login" component={Login} />
          <Tab.Screen name="Signup" component={Signup} />
        </Tab.Navigator>
      </View>

    </ImageBackground>

  )
}

export default Start

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    flex: 1
  },
})