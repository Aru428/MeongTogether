// 닉네임
import { configureStore } from "@reduxjs/toolkit";
import persistedUserReducer from "../reducer/nicknameReducer";
import { persistStore } from "redux-persist";

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
  middleware: (DefaultMiddleware) =>
    DefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
