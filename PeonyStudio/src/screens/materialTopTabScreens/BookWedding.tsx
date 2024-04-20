import { View, Text, FlatList } from 'react-native'
import React from 'react'
import Color from '../../Color'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import BookingWeddingDressCardItem from '../../components/BookingWeddingDressCardItem'

const BookWedding: React.FC = () => {

  const ListBookWeddingDress = useSelector((state: RootState) => state.BookWeddingDressRentalStore.ListBookWeddingDressRental)

  if (ListBookWeddingDress.length === 0) {
    return (
      <View style={{ backgroundColor: Color.white, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: Color.deepPink, fontStyle: 'italic' }}>
          Không có áo cưới nào đang đặt
        </Text>
      </View>
    )
  }

  return (
    <View style={{ backgroundColor: Color.white, flex: 1 }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={ListBookWeddingDress}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookingWeddingDressCardItem BookWeddingDressRental={item} />
          )}
        />
      </View>
    </View>
  )
}

export default BookWedding