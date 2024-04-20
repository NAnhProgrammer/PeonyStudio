import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addBookWeddingDressRentalAPI, changeStatusBookWeddingDressRentalAPI } from '../actions/BookWeddingDressRentalAction';

interface BookWeddingDressRental {
    id: string,
    bookingTime: Date,
    acceptTime: Date,
    id_User: string,
    id_WeddingDress: string,
    appointmentDate: Date,
    status: number
}

interface BookWeddingDressRentalState {
    ListBookWeddingDressRental: any[]
}

const initialState: BookWeddingDressRentalState = {
    ListBookWeddingDressRental: []
}

const BookWeddingDressRentalSlice = createSlice({
    name: 'bookWeddingDressRental',
    initialState,
    reducers: {
        // làm việc cục bộ
        addBookWeddingDressRental(state, action: PayloadAction<BookWeddingDressRental>) {
            state.ListBookWeddingDressRental.push(action.payload)
        },
        clearListBookWeddingDressRental(state) {
            state.ListBookWeddingDressRental.splice(0, state.ListBookWeddingDressRental.length)
        }
    },
    extraReducers: builder => {

        builder.addCase(addBookWeddingDressRentalAPI.fulfilled, (state, action) => {
            state.ListBookWeddingDressRental.push(action.payload)
        }).addCase(addBookWeddingDressRentalAPI.rejected, (state, action) => {
            console.log('Thêm lịch đặt áo cưới lỗi ', action.error.message)
        })

        builder.addCase(changeStatusBookWeddingDressRentalAPI.fulfilled, (state, action) => {

            state.ListBookWeddingDressRental = state.ListBookWeddingDressRental.filter(row => row.id !== action.payload)

        }).addCase(changeStatusBookWeddingDressRentalAPI.rejected, (state, action) => {
            console.log('Cập nhật lịch đặt áo cưới lỗi ', action.error.message)
        })
    }
})

export const { addBookWeddingDressRental, clearListBookWeddingDressRental } = BookWeddingDressRentalSlice.actions
export default BookWeddingDressRentalSlice.reducer