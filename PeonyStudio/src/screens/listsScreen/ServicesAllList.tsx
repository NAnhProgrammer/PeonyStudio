import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../../Color'

import AntDesign from 'react-native-vector-icons/AntDesign'

import { useRoute, useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import WeddingDressCardAll from '../../components/WeddingDressCardAll'
import ServicesCardAll from '../../components/ServicesCardAll'

const ServicesAllList: React.FC = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { userID } = route.params

    const ListServices = useSelector((state: RootState) => state.ServicesStore.ListServices)

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='left' color={Color.deepPink} size={30} />
                </TouchableOpacity>
                <Text style={{ marginLeft: 20, fontSize: 26, color: Color.deepPink }}>Danh sách dịch vụ</Text>
            </View>

            <FlatList
                    data={ListServices}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ServicesCardAll services={item} userID={userID} />
                    )}
                />
        </View>
    )
}

export default ServicesAllList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    tabBar: {
        flexDirection: 'row',
        margin: 5,
        alignItems: 'center'
    }
})