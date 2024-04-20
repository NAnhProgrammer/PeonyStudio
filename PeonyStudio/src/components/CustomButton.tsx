import { View, Text, StyleProp, TextStyle, ViewStyle, TouchableOpacity } from 'react-native'
import React from 'react'

interface props {
    title: string,
    titleStyle: StyleProp<TextStyle>
    viewStyle: StyleProp<ViewStyle>
    onPress: () => void
}

const CustomButton: React.FC<props> = ({ title, titleStyle, viewStyle, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={viewStyle}>
            <Text style={titleStyle}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton