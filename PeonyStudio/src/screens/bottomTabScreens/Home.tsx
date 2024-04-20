import { ActivityIndicator, Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React from 'react'
import Color from '../../Color'
import CustomButton from '../../components/CustomButton'
import { useRoute, useNavigation } from '@react-navigation/native'


import AntDesign from 'react-native-vector-icons/AntDesign'
import Swiper from 'react-native-swiper'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import WeddingDressCardItem from '../../components/WeddingDressCardItem'
import ServicesCardItem from '../../components/ServicesCardItem'
import NewsCardItem from '../../components/NewsCardItem'

const { width, height } = Dimensions.get('window')

const Home: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  const ListWeddingDress = useSelector((state: RootState) => state.WeddingDressStore.ListWeddingDress)
  const ListServices = useSelector((state: RootState) => state.ServicesStore.ListServices)
  const ListNews = useSelector((state: RootState) => state.NewsStore.ListNews)

  const [weddingDressData, setWeddingDressData] = React.useState<any>([])
  const [servicesData, setServicesData] = React.useState<any>([])
  const [newsData, setNewsData] = React.useState<any>([])

  React.useEffect(() => {
    const { user } = route.params as { user: any }
    setUser(user)
  }, [])

  React.useEffect(() => {
    setWeddingDressData(ListWeddingDress.slice(0, 5))
    setServicesData(ListServices.slice(0, 5))
    setNewsData(ListNews.slice(0, 5))

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000)

    return () => clearTimeout(timer)
  }, [ListWeddingDress, ListServices, ListNews])

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

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', margin: 5, justifyContent: 'space-between', alignItems: 'center' }}>

        <View style={{ borderWidth: 0.8, borderColor: Color.deepPink, padding: 3, borderRadius: 30 }}>
          <Image source={{ uri: user.avatar }}
            style={{ width: 45, height: 45, borderRadius: 25 }} />
        </View>

        <Text style={{ fontFamily: 'edwardianscriptitc', fontSize: 50, color: Color.deepPink }}>
          PeonyStudio
        </Text>

        <TouchableOpacity
          style={{ padding: 10, backgroundColor: Color.deepPink, borderRadius: 10 }}
        >
          <AntDesign name='search1' size={25} color={Color.white} />
        </TouchableOpacity>

      </View>

      <View style={styles.itemContainer}>
        <Swiper
          showsButtons={false}
          loop
          autoplayTimeout={5}
          autoplay
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

      <View style={{ marginVertical: 5, flex: 1, marginBottom: 60 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.h1Container}>
            <Text style={styles.h1Title}>Áo Cưới</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('WeddingDressAllList', { userID: user.id })}
            >
              <Text style={styles.viewMore}>{'Xem thêm >>'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={weddingDressData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <WeddingDressCardItem weddingDress={item} userID={user.id} />
            )}
          />

          <View style={styles.h1Container}>
            <Text style={styles.h1Title}>Dịch Vụ</Text>
            <TouchableOpacity
             onPress={() => navigation.navigate('ServicesAllList', { userID: user.id })}
            >
              <Text style={styles.viewMore}>{'Xem thêm >>'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={servicesData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ServicesCardItem services={item} userID={user.id} />
            )}
          />

          <View style={styles.h1Container}>
            <Text style={styles.h1Title}>Tin Tức</Text>
            <TouchableOpacity>
              <Text style={styles.viewMore}>{'Xem thêm >>'}</Text>
            </TouchableOpacity>
          </View>

          {newsData.map(item => (
            <View key={item.id}>
              <NewsCardItem imageId={item.images[0]}
                title={item.title}
                content={item.content}
              />
            </View>
          ))}

          {/* <FlatList
            data={newsData}
            horizontal
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              
            )}
          /> */}

        </ScrollView>

      </View>

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white
  },
  itemContainer: {
    marginVertical: 10,
    height: height * 0.25,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  h1Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 5
  },
  h1Title: {
    fontSize: 23,
    paddingBottom: 2,
    fontWeight: 'bold',
    color: Color.deepPink,
  },
  viewMore: {
    fontSize: 15,
    color: Color.purpleA100,
    fontStyle: 'italic'
  }
})