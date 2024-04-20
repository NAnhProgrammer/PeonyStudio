import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../Color'
import axios from 'axios'

interface props {
  imageId: string,
  title: string,
  content: number,
}

const { width, height } = Dimensions.get('window')

const NewsCardItem: React.FC<props> = ({ imageId, title, content }) => {

  const [uri, setUri] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(true)

  const getImage = async () => {
    try {
      const response = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-image-by-id?id=${imageId}`)
      setUri(response.data.image[0].secureUrl)
      setLoading(false)
    } catch (error) {
      console.log('Err: ', error)
    }
  }

  React.useEffect(() => {
    getImage()
  }, [])

  return (
    <View style={styles.container}>
      {loading && <View style={styles.loading}>
        <ActivityIndicator size='small' color={Color.deepPink} />
      </View>}
      {!loading && <TouchableOpacity>
        <Image source={{ uri: uri }} style={styles.image} />
      </TouchableOpacity>}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View>
          <Text style={styles.content}>{content}</Text>
        </View>
      </View>
    </View>
  )
}

export default NewsCardItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width-10,
    height: 190,
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
    width: 130,
    height: 190,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    resizeMode: 'cover',
    marginRight: 5
  },
  loading: {
    width: 130,
    height: 190,
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
    fontSize: 17,
    color: Color.deepPink,
    fontWeight: 'bold'
  },
  content: {
    fontSize: 13,
    color: Color.purpleA100
  }
})