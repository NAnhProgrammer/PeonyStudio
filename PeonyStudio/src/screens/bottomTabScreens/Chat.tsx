import { View, Text, Dimensions, ActivityIndicator, FlatList } from 'react-native'
import React from 'react'
import Color from '../../Color'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { it } from '@jest/globals';
import ChatCardItem from '../../components/ChatCardItem'

const { width, height } = Dimensions.get('window')

const Chat: React.FC = () => {
  const route = useRoute()
  const { user } = route.params

  const [loading, setLoading] = React.useState<boolean>(true)
  const [chatList, setChatList] = React.useState<any>([])

  const callChatList = async () => {
    try {
      setChatList([])
      const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/find-user-chats', { userId: user.id })
      setChatList(response.data)

      setLoading(false)
    } catch (error) {
      console.log('Chat err: ', error)
    }
  }

  React.useEffect(() => {
    callChatList()
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Color.white, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={Color.deepPink} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Color.white }}>
      <Text style={{ color: Color.deepPink, fontSize: 24, textAlign: 'center', margin: 5, fontWeight: 'bold' }}>Danh sách trò chuyện</Text>

      <FlatList
        data={chatList}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatCardItem chat={item} user1st={user} />
        )}
      />
    </View>
  )
}

export default Chat