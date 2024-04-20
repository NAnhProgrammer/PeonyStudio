import { createAsyncThunk } from '@reduxjs/toolkit'
import { addWeddingDress, clearListWeddingDress } from '../reducers/WeddingDressReducer'
import axios from 'axios'

const baseUrl = 'https://mobile-react-native-workshop-server.onrender.com'

interface WeddingDress {
    id: string,
    name: string,
    purchasePrice: number,
    rentalCost: number,
    quantity: number,
    outstanding: string,
    describes: string[],
    images: string[],
    status: boolean
}

export const getWeddingDress = createAsyncThunk(
    'weddingDress/getWeddingDress',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get<WeddingDress[]>(`${baseUrl}/get-list-wedding-dress`)
            dispatch(clearListWeddingDress())
            response.data.forEach(element => {
                dispatch(addWeddingDress(element))
            });
        } catch (error) {
            return rejectWithValue('Lỗi: ' + error)
        }
    }
)