import { useReducer, createContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: "",
  isAuthenticated: false,
  isLoading: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload?.user,
        token: action.payload?.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: "",
      };
    case "LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: false,
      };

    case "UPDATE_WISHLIST":
      return {
        ...state,
        user: {
          ...state.user,
          wishlist: action.payload.userWishList,
        },
      };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    async function checkLogin() {
      dispatch({ type: "LOADING" });
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/authenticate-user`,
          {},
          { withCredentials: true }
        );
        if (response.status == 200 && response.data) {
          dispatch({
            type: "LOGIN",
            payload: {
              user: response?.data?.user,
              token: response?.data?.token,
            },
          });
          dispatch({ type: "SET_LOADING" });
        }
      } catch (err) {
        console.log(err);
        dispatch({ type: "SET_LOADING" });
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
