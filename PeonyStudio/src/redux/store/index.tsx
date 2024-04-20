import {combineReducers ,configureStore  } from "@reduxjs/toolkit";

import WeddingDressReducer from "../reducers/WeddingDressReducer";
import ServicesReducer from "../reducers/ServicesReducer";
import NewsReducer from "../reducers/NewsReducer";
import BookWeddingDressRentalReducer from "../reducers/BookWeddingDressRentalReducer";
import BookServiceAppointmentReducer from "../reducers/BookServiceAppointmentReducer";
import BookPhotoPrintingReducer from "../reducers/BookPhotoPrintingReducer";
import BookConsultationReducer from "../reducers/BookConsultationReducer";
import GetImagesReducer from "../reducers/GetImagesReducer";


const rootReducer = combineReducers({
    WeddingDressStore: WeddingDressReducer,
    ServicesStore: ServicesReducer,
    NewsStore: NewsReducer,
    BookWeddingDressRentalStore: BookWeddingDressRentalReducer,
    BookServiceStore: BookServiceAppointmentReducer,
    BookPhotoPrintingStore: BookPhotoPrintingReducer,
    BookConsultationStore: BookConsultationReducer,
    GetImagesStore: GetImagesReducer
})

const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default store

