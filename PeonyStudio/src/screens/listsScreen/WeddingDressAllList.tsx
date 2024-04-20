import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Color from '../../Color'

import AntDesign from 'react-native-vector-icons/AntDesign'

import { useRoute, useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import WeddingDressCardAll from '../../components/WeddingDressCardAll'

const WeddingDressAllList: React.FC = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { userID } = route.params

    const ListWeddingDress = useSelector((state: RootState) => state.WeddingDressStore.ListWeddingDress)

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='left' color={Color.deepPink} size={30} />
                </TouchableOpacity>
                <Text style={{ marginLeft: 20, fontSize: 26, color: Color.deepPink }}>Danh sách áo cưới</Text>
            </View>

            <FlatList
                    data={ListWeddingDress}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <WeddingDressCardAll weddingDress={item} userID={userID} />
                    )}
                />
        </View>
    )
}

export default WeddingDressAllList

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