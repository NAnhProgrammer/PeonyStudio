import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addBookServiceAppointmentAPI, changeStatusBookServiceAppointmentAPI } from '../actions/BookServiceAppointmentAction';

interface BookServiceAppointment {
    id: string,
    bookingTime: Date,
    acceptTime: Date,
    id_User: string,
    id_Services: string,
    appointmentDate: Date,
    status: number
}

interface BookServiceAppointmentState {
    ListBookServiceAppointment: any[]
}

const initialState: BookServiceAppointmentState = {
    ListBookServiceAppointment: []
}

const BookServiceAppointmentSlice = createSlice({
    name: 'bookServiceAppointment',
    initialState,
    reducers: {
        // làm việc cục bộ
        addBookServiceAppointment(state, action: PayloadAction<BookServiceAppointment>) {
            state.ListBookServiceAppointment.push(action.payload)
        },
        clearListBookServiceAppointment(state) {
            state.ListBookServiceAppointment.splice(0, state.ListBookServiceAppointment.length)
        }
    },
    extraReducers: builder => {

        builder.addCase(addBookServiceAppointmentAPI.fulfilled, (state, action) => {
            state.ListBookServiceAppointment.push(action.payload)
        }).addCase(addBookServiceAppointmentAPI.rejected, (state, action) => {
            console.log('Thêm lịch dịch vụ lỗi ', action.error.message)
        })

        builder.addCase(changeStatusBookServiceAppointmentAPI.fulfilled, (state, action) => {

            state.ListBookServiceAppointment = state.ListBookServiceAppointment.filter(row => row.id !== action.payload)

        }).addCase(changeStatusBookServiceAppointmentAPI.rejected, (state, action) => {
            console.log('Cập nhật lịch dịch vụ lỗi ', action.error.message)
        })
    }
})

export const { addBookServiceAppointment,clearListBookServiceAppointment } = BookServiceAppointmentSlice.actions
export default BookServiceAppointmentSlice.reducer