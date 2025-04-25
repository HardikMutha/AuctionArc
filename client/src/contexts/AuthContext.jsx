import { useReducer, createContext } from "react";

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
        user: action.payload.user,
        token: action.payload.token,
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
    default:
      state;
  }
};

const AuthProvider = (children) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await axios.post(
          `http://localhost:3000/auth/authenticate-user`,
          {},
          { withCredentials: true }
        );
        if (response.status == 200) {
          dispatch({type:"LOADING"});
          dispatch({type:"LOGIN",paylod:{user:response.data.user,token:response.data.token}});
          dispatch({type:"SET_LOADING"});
        }
      } catch (err) {
        console.log(err);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={(state, dispatch)}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
