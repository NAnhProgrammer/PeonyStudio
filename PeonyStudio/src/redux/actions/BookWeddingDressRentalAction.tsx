import { createAsyncThunk } from '@reduxjs/toolkit'
import { addBookWeddingDressRental, clearListBookWeddingDressRental } from '../reducers/BookWeddingDressRentalReducer'
import axios from 'axios'

const baseUrl = 'https://mobile-react-native-workshop-server.onrender.com'

interface props {
    id_user: string,
    id: string
}

interface BookWeddingDressRental {
    id: string,
    bookingTime: Date,
    acceptTime: Date,
    id_User: string,
    id_WeddingDress: string,
    appointmentDate: Date,
    status: number
}

export const getBookWeddingDressRental = createAsyncThunk(
    'bookWeddingDressRental/getBookWeddingDressRental',
    async ({ id_user }: props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post<BookWeddingDressRental[]>(`${baseUrl}/find-book-wedding-dress-rental-by-id-user`, { id_user: id_user })
            dispatch(clearListBookWeddingDressRental())
            response.data.forEach(element => {
                if (element.status !== 3) {
                    dispatch(addBookWeddingDressRental(element))
                }
            });
        } catch (error) {
            return rejectWithValue('Lỗi: ' + error)
        }
    }
)

export const addBookWeddingDressRentalAPI = createAsyncThunk(
    'bookWeddingDressRental/addBookWeddingDressRentalAPI',
    async (object, thunkAPI) => {
        try {
            // Gửi yêu cầu Add đến API

            const response = await axios.post(`${baseUrl}/add-book-wedding-dress-rental`, object)
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

export const changeStatusBookWeddingDressRentalAPI = createAsyncThunk(
    'bookWeddingDressRental/changeStatusBookWeddingDressRentalAPI',
    async (object, thunkAPI) => {
        try {
            // Gửi yêu cầu update đến API 

            const response = await axios.post(`${baseUrl}/update-book-wedding-dress-rental`, object)
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

