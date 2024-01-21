const LOAD_SPOTS = 'spot/loadSpots';
const LOAD_SPOT = 'spot/loadSpot';

const loadSpots = spots => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};

const loadSpot = spot => {
    return {
        type: LOAD_SPOT,
        spot
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

export const fetchSpot = spotId => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpot(data));
    }
}

const intialState = {};

const spotReducer = (state = intialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            return { ...state, spots: [...action.spots] };
        case LOAD_SPOT:
            return { ...state, spot: action.spot };
        default:
            return state;
    }
};

export default spotReducer;
