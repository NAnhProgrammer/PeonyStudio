import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface WeddingDressState{
    ListWeddingDress : any[]
}

const initialState : WeddingDressState = {
    ListWeddingDress: []
}

const WeddingDressSlice = createSlice({
    name:'weddingDress',
    initialState,
    reducers:{
        // làm việc cục bộ
        addWeddingDress(state, action: PayloadAction<WeddingDress>){
            state.ListWeddingDress.push(action.payload)
        },
        clearListWeddingDress(state){
            state.ListWeddingDress.splice(0,state.ListWeddingDress.length)
        }
    },
    // extraReducers: builder =>{
    //     builder.addCase()
    // }
})

export const {addWeddingDress, clearListWeddingDress} = WeddingDressSlice.actions
export default WeddingDressSlice.reducer