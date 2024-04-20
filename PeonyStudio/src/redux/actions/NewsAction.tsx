import { createAsyncThunk } from '@reduxjs/toolkit'
import { addNews, clearListNews } from '../reducers/NewsReducer'
import axios from 'axios'

const baseUrl = 'https://mobile-react-native-workshop-server.onrender.com'

interface News {
    id: string,
    title: string,
    content: number,
    images: string[],
    status: boolean
}

export const getNews = createAsyncThunk(
    'news/getNews',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get<News[]>(`${baseUrl}/get-list-news`)
            dispatch(clearListNews())
            response.data.forEach(element => {
                dispatch(addNews(element))
            });
        } catch (error) {
            return rejectWithValue('Lỗi: ' + error)
        }
    }
)