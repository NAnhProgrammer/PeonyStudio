import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Color from '../../Color'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import BookingServiesCardItem from '../../components/BookingServiesCardItem'

const BookServices: React.FC = () => {

  const ListServices = useSelector((state: RootState) => state.BookServiceStore.ListBookServiceAppointment)

  if (ListServices.length === 0) {
    return (
      <View style={{ backgroundColor: Color.white, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: Color.deepPink, fontStyle: 'italic' }}>
          Không có dịch vụ nào đang đặt
        </Text>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: Color.white, flex: 1 }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={ListServices}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookingServiesCardItem BookingServies={item} />
          )}
        />
      </View>
    </View>
  )
}

export default BookServices