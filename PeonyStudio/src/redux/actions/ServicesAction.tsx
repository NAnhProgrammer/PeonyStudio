import { createAsyncThunk } from '@reduxjs/toolkit'
import { addServices, clearListServices } from '../reducers/ServicesReducer'
import axios from 'axios'

const baseUrl = 'https://mobile-react-native-workshop-server.onrender.com'

interface Services {
    id: string,
    serviceName: string,
    servicePrice: number,
    describes: string[],
    images: string[],
    status: boolean
}

export const getServices = createAsyncThunk(
    'services/getServices',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get<Services[]>(`${baseUrl}/get-list-services`)
            dispatch(clearListServices())
            response.data.forEach(element => {
                dispatch(addServices(element))
            });
        } catch (error) {
            return rejectWithValue('Lỗi: ' + error)
        }
    }
)