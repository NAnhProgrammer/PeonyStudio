import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface News {
    id: string,
    title: string,
    content: number,
    images: string[],
    status: boolean
}

interface NewsState{
    ListNews : any[]
}

const initialState : NewsState = {
    ListNews: []
}

const NewsSlice = createSlice({
    name:'news',
    initialState,
    reducers:{
        // làm việc cục bộ
        addNews(state, action: PayloadAction<News>){
            state.ListNews.push(action.payload)
        },
        clearListNews(state){
            state.ListNews.splice(0, state.ListNews.length)
        }
    },
    // extraReducers: builder =>{
    //     builder.addCase()
    // }
})

export const {addNews, clearListNews} = NewsSlice.actions
export default NewsSlice.reducer