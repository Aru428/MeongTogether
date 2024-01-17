import storage from "redux-persist/lib/storage";
import {
  LOGIN_SUCCESS,
  UPDATE_USER,
  LOGOUT,
  DELETE_SUCCESS,
} from "../action/nicknameAction";
import { persistReducer } from "redux-persist";

const initialState = {
  isLoggedIn: false,
  user_id: "",
  nickname: "",
};

// 닉네임
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      const { user_id, nickname } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        user_id,
        nickname,
      };
    }
    case LOGOUT:
      return initialState;
    case DELETE_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export default persistedUserReducer;
