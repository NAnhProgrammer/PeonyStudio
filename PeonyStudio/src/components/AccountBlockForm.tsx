import { View, Text, StyleProp, TextStyle, ViewStyle } from 'react-native'
import React from 'react'

interface props {
    title: string,
    titleStyle?: StyleProp<TextStyle>,
    viewStyle?: StyleProp<ViewStyle>,
    children: React.ReactNode
}

const AccountBlockForm: React.FC<props> = ({ title, titleStyle, viewStyle, children }) => {
    return (
        <View style={viewStyle}>
            <Text style={titleStyle}>{title}</Text>
            {children}
        </View>
    )
}

export default AccountBlockForm