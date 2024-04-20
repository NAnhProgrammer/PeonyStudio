import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addBookConsultationAPI, changeStatusBookConsultationAPI } from '../actions/BookConsultationAction';

interface BookConsultation {
    id: string,
    bookingTime: Date,
    acceptTime: Date,
    id_User: string,
    appointmentDate: Date,
    status: number
}

interface BookConsultationState {
    ListBookConsultation: any[]
}

const initialState: BookConsultationState = {
    ListBookConsultation: []
}

const BookConsultationSlice = createSlice({
    name: 'bookConsultation',
    initialState,
    reducers: {
        // làm việc cục bộ
        addBookConsultation(state, action: PayloadAction<BookConsultation>) {
            state.ListBookConsultation.push(action.payload)
        },
        clearListBookConsultation(state) {
            state.ListBookConsultation.splice(0, state.ListBookConsultation.length)
        }
    },
    extraReducers: builder => {

        builder.addCase(addBookConsultationAPI.fulfilled, (state, action) => {
            state.ListBookConsultation.push(action.payload)
        }).addCase(addBookConsultationAPI.rejected, (state, action) => {
            console.log('Thêm lịch tư vấn lỗi ', action.error.message)
        })

        builder.addCase(changeStatusBookConsultationAPI.fulfilled, (state, action) => {

            state.ListBookConsultation = state.ListBookConsultation.filter(row => row.id !== action.payload)

        }).addCase(changeStatusBookConsultationAPI.rejected, (state, action) => {
            console.log('Cập nhật lịch tư vấn lỗi ', action.error.message)
        })
    }
})

export const { addBookConsultation, clearListBookConsultation } = BookConsultationSlice.actions
export default BookConsultationSlice.reducer