import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addBookPhotoPrintingAPI, changeStatusBookPhotoPrintingAPI } from '../actions/BookPhotoPrintingAction';

interface BookPhotoPrinting {
    id: string,
    bookingTime: Date,
    acceptTime: Date,
    id_User: string,
    appointmentDate: Date,
    status: number
}

interface BookPhotoPrintingState {
    ListBookPhotoPrinting: any[]
}

const initialState: BookPhotoPrintingState = {
    ListBookPhotoPrinting: []
}

const BookPhotoPrintingSlice = createSlice({
    name: 'bookPhotoPrinting',
    initialState,
    reducers: {
        // làm việc cục bộ
        addBookPhotoPrinting(state, action: PayloadAction<BookPhotoPrinting>) {
            state.ListBookPhotoPrinting.push(action.payload)
        },
        clearListBookPhotoPrinting(state) {
            state.ListBookPhotoPrinting.splice(0, state.ListBookPhotoPrinting.length)
        }
    },
    extraReducers: builder => {

        builder.addCase(addBookPhotoPrintingAPI.fulfilled, (state, action) => {
            state.ListBookPhotoPrinting.push(action.payload)
        }).addCase(addBookPhotoPrintingAPI.rejected, (state, action) => {
            console.log('Thêm lịch in ảnh lỗi ', action.error.message)
        })

        builder.addCase(changeStatusBookPhotoPrintingAPI.fulfilled, (state, action) => {

            state.ListBookPhotoPrinting = state.ListBookPhotoPrinting.filter(row => row.id !== action.payload)

        }).addCase(changeStatusBookPhotoPrintingAPI.rejected, (state, action) => {
            console.log('Cập nhật lịch in ảnh lỗi ', action.error.message)
        })
    }
})

export const { addBookPhotoPrinting, clearListBookPhotoPrinting } = BookPhotoPrintingSlice.actions
export default BookPhotoPrintingSlice.reducer