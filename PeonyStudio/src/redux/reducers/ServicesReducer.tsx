import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Services {
    id: string,
    serviceName: string,
    servicePrice: number,
    describes: string[],
    images: string[],
    status: boolean
}

interface ServicesState{
    ListServices : any[]
}

const initialState : ServicesState = {
    ListServices: []
}

const ServicesSlice = createSlice({
    name:'services',
    initialState,
    reducers:{
        // làm việc cục bộ
        addServices(state, action: PayloadAction<Services>){
            state.ListServices.push(action.payload)
        },
        clearListServices(state){
            state.ListServices.splice(0,state.ListServices.length)
        }
    },
    // extraReducers: builder =>{
    //     builder.addCase()
    // }
})

export const {addServices, clearListServices} = ServicesSlice.actions
export default ServicesSlice.reducer