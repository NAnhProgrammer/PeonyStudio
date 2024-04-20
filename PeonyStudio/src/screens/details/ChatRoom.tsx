import { View, Text, Dimensions, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import React from 'react'
import Color from '../../Color'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation, useRoute } from '@react-navigation/native'
import io from 'socket.io-client'
import axios from 'axios'
import MessageCardItem from '../../components/MessageCardItem'

const socket = io('https://mobile-react-native-workshop-server.onrender.com');

const { width, height } = Dimensions.get('window')

const ChatRoom: React.FC = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const { idChat, user } = route.params
    const [loading, setLoading] = React.useState<boolean>(true)
    const [messageList, setMessageList] = React.useState<any>([])

    const [messageInput, setMessageInput] = React.useState<string>('')

    socket.emit('join-room', idChat);

    const getListMessage = async () => {
        try {
            setMessageList([])
            const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/find-messages', { chatId: idChat })
            setMessageList(response.data)
            setLoading(false)
        } catch (error) {
            console.log('Lỗi message: ', error)
        }
    }

    const handleSendMessage = async () => {
        if (messageInput === '') {
            return;
        }
    
        const newMessage = {
            chatId: idChat,
            senderId: user.id,
            text: messageInput
        };
    
        try {
            const addMessage = await axios.post('https://mobile-react-native-workshop-server.onrender.com/create-message', newMessage);
            if (addMessage.status === 200) {
                socket.emit('message', { roomName: idChat, message: addMessage.data });
                setMessageInput('');
            }
        } catch (error) {
            console.log('Lỗi gửi: ', error);
        }
    };
    

    React.useEffect(() => {
        getListMessage()

        socket.on('new-message', (message) => {
            setMessageList((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('new-message');
        };
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

            <View style={{ backgroundColor: Color.deepPink, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Entypo name='chevron-thin-left' color={Color.white} size={25} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: Color.white }}>Trò chuyện với Peony</Text>
                <TouchableOpacity>
                    <Text>{' '}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ margin: 10, flex: 1 }}>
                    <FlatList
                        data={messageList}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                        extraData={messageList.lenght}
                        renderItem={({ item }) => (
                            <MessageCardItem message={item} idSender={user.id} />
                        )}
                    />
                </View>
                <View>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10 }}>
                            <View style={{ paddingHorizontal: 3, borderRadius: 10, borderWidth: 1, borderColor: Color.deepPink, flex: 1, marginRight: 10 }}>
                                <TextInput
                                    value={messageInput}
                                    onChangeText={text => setMessageInput(text)}
                                    selectionColor={Color.deepPink}
                                    placeholder='Nhập tin nhắn...'
                                    placeholderTextColor={Color.pink200}
                                    style={{ color: Color.deepPink, fontSize: 15 }} />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleSendMessage()}
                            >
                                <Ionicons name='send-sharp' color={Color.deepPink} size={25} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>

        </View>
    )
}

export default ChatRoom