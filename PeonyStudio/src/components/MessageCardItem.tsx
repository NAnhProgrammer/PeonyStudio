import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Color from '../Color'
import FormatDateTime from '../functions/FormatDateTime'

interface props {
    message: any
    idSender: string
}

const MessageCardItem: React.FC<props> = ({ message, idSender }) => {
    return (
        <View style={message.senderId === idSender ? styles.rightMessage : styles.leftMessage}>
            <Text style={styles.text}>{message.text}</Text>
            <Text style={styles.dateTime}>{FormatDateTime(message.createdAt)}</Text>
        </View>
    )
}

export default MessageCardItem

const styles = StyleSheet.create({
    leftMessage: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 8,
        marginRight: 90,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: Color.purpleA400
    },
    rightMessage: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 8,
        marginLeft: 90,
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: Color.deepPink
    },
    text: {
        color: Color.white,
        fontSize: 16
    },
    dateTime: {
        marginTop:5,
        color: Color.white,
        fontSize: 13,
        fontStyle: 'italic'
    }
})