import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface images {
    id: string,
    publicId: string,
    secureUrl: number
}

interface GetImagesReducerState {
    ListImages: any[]
}

const initialState: GetImagesReducerState = {
    ListImages: []
}

const GetImagesReducerSlice = createSlice({
    name: 'getImagesReducer',
    initialState,
    reducers: {
        // làm việc cục bộ
        addGetImages(state, action: PayloadAction<images>) {
            state.ListImages.push(action.payload)
        },
        clearListImages(state) {
            state.ListImages.splice(0, state.ListImages.length)
        }
    }
})

export const { addGetImages, clearListImages } = GetImagesReducerSlice.actions
export default GetImagesReducerSlice.reducer