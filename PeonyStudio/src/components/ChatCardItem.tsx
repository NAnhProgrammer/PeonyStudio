import { ActivityIndicator, Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Color from '../Color'
import FormatDateTime from '../functions/FormatDateTime'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

interface props {
    chat: any
    user1st: any
}

const { width, height } = Dimensions.get('window')

const ChatCardItem: React.FC<props> = ({ chat, user1st }) => {
    const navigation = useNavigation()

    const [loading, setLoading] = React.useState<boolean>(true)
    const [user, setUser] = React.useState<any>(null)
    const [latestMessage, setLatestMessage] = React.useState<string>('')
    const [titleRoom, setTitleRoom] = React.useState<string>('')

    const get2ndUser = async (id: string) => {
        // if (id !== 'admin31267') {
        //     const response = axios.get(`https://mobile-react-native-workshop-server.onrender.com/get-user-by-id/`)
        // }
        const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/find-latest-message', { chatId: chat._id })
        setLatestMessage(response.data)
        setLoading(false)
    }

    const handleOpenChat = () => {
        navigation.navigate('ChatRoom', {idChat: chat._id, user: user1st})
    }

    React.useEffect(() => {
        const user2nd = chat.members.filter(item => item !== user1st.id).join(',')
        get2ndUser(user2nd)
    }, [])

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size='small' color={Color.deepPink} />
            </View>
        )
    }

    return (
        <TouchableOpacity
        onPress={()=>handleOpenChat()}
        style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ borderWidth: 1, marginRight: 10, borderColor: Color.pink200, borderRadius: 50, justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                    <Image style={styles.image} source={{ uri: user === null ? 'https://st2.depositphotos.com/1059902/6823/i/450/depositphotos_68230083-stock-photo-peony-flower-closeup-isolated-on.jpg' : user.avatar }} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{user === null ? 'Peony Studio' : (user.lastName + ' ' + user.firstName)}</Text>
                    <Text style={styles.latestMessage}>{latestMessage.text}</Text>
                    <Text style={styles.dateTime}>{FormatDateTime(latestMessage.createdAt)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ChatCardItem

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: Color.pink200,
        width,
        paddingVertical: 5,
        height: 85,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 50,
    },
    title: {
        fontSize: 18,
        color: Color.deepPink,
        fontWeight: 'bold'
    },
    latestMessage: {
        fontSize: 15,
        color: Color.deepPink,
    },
    dateTime: {
        fontSize: 13,
        color: Color.purpleA100,
        marginTop: 3
    }
})