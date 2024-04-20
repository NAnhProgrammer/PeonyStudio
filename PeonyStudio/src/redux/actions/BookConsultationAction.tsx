import { createAsyncThunk } from '@reduxjs/toolkit'
import { addBookConsultation, clearListBookConsultation } from '../reducers/BookConsultationReducer'
import axios from 'axios'

const baseUrl = 'https://mobile-react-native-workshop-server.onrender.com'

interface props {
    id_user: string,
    id: string
}

interface BookConsultation {
    id: string,
    bookingTime: Date,
    acceptTime: Date,
    id_User: string,
    appointmentDate: Date,
    status: number
}

export const getBookConsultation = createAsyncThunk(
    'bookConsultation/getbPhotoPrinting',
    async ({ id_user }: props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post<BookConsultation[]>(`${baseUrl}/find-book-consultation-by-id-user`, { id_user: id_user })
            dispatch(clearListBookConsultation())
            response.data.forEach(element => {
                if (element.status !== 3) {
                    dispatch(addBookConsultation(element))
                }
            });
        } catch (error) {
            return rejectWithValue('Lỗi: ' + error)
        }
    }
)

export const addBookConsultationAPI = createAsyncThunk(
    'bookConsultation/addBookConsultationAPI',
    async (object, thunkAPI) => {
        try {
            // Gửi yêu cầu Add đến API

            const response = await axios.post(`${baseUrl}/add-book-consultation`, object)
            // console.log(response);
            // Kiểm tra nếu status code là 200 thì thành công
            if (response.status === 200) {
                // console.log(response);
                // Sau khi thành công, trả về id đã để cập nhật store

                return object;
            } else {
                // Nếu có lỗi từ phía server, trả về lỗi
                return thunkAPI.rejectWithValue(response.status);
            }
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const changeStatusBookConsultationAPI = createAsyncThunk(
    'bookConsultation/changeStatusBookConsultationAPI',
    async (object, thunkAPI) => {
        try {
            // Gửi yêu cầu update đến API 

            const response = await axios.post(`${baseUrl}/update-book-consultation`, object)
            // console.log(response);
            // Kiểm tra nếu status code là 200 thì thành công
            if (response.status === 200) {
                // console.log(response);
                // Sau khi thành công, trả về id đã để cập nhật store

                return object.id;
            } else {
                // Nếu có lỗi từ phía server, trả về lỗi
                return thunkAPI.rejectWithValue(response.status);
            }
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            return thunkAPI.rejectWithValue(error);
        }
    }
);

