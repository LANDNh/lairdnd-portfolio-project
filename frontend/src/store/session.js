import { csrfFetch } from "./csrf";

const LOGIN = 'session/LOGIN';
const LOGOUT = 'session/LOGOUT';

const login = user => {
    return {
        type: LOGIN,
        payload: user
    };
};

const logout = () => {
    return {
        type: LOGOUT
    };
};

export const userLogin = (user) => async dispatch => {
    const { credential, password } = user;
    const res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({ credential, password })
    });

    const data = await res.json();
    dispatch(login(data.user));
    return res;
}

const initialState = {
    user: null
}

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, user: action.payload };
        case LOGOUT:
            return { ...state, user: null };
        default:
            return state;
    }
};

export default sessionReducer;
