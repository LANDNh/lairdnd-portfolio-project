

const LOAD_SPOTS = 'spot/loadSpots';

const loadSpots = spots => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};

export const fetchSpots = () => async dispatch => {
    const res = await fetch('/api/spots');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpots(data.Spots));
        return data;
    }
};

const intialState = {};

const spotReducer = (state = intialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            return { ...state, spots: [...action.spots] };
        default:
            return state;
    }
};

export default spotReducer;
