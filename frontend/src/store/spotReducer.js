import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_SPOTS = 'spot/loadSpots';
const LOAD_SPOT = 'spot/loadSpot';
const ADD_SPOT = 'spot/addSpot';
const UPDATE_SPOT = 'spot/updateSpot';
const DELETE_SPOT = 'spot/deleteSpot';

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

const addSpot = spot => {
    return {
        type: ADD_SPOT,
        spot
    };
};

const updateSpot = spot => {
    return {
        type: UPDATE_SPOT,
        spot
    };
};

const deleteSpot = spotId => {
    return {
        type: DELETE_SPOT,
        spotId
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
};

export const createSpot = spot => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spot)
    });

    if (res.ok) {
        const newSpot = await res.json();
        dispatch(addSpot(newSpot));
        return newSpot;
    }
};

export const modifySpot = spot => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        body: JSON.stringify(spot)
    });

    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(updateSpot(updatedSpot));
        return updatedSpot;
    }
};

export const removeSpot = spotId => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteSpot(spotId));
    } else {
        const errors = await res.json();
        return errors;
    }
}

const selectSpots = state => state?.spots;

export const selectAllSpots = createSelector(selectSpots, spots => {
    return spots ? Object.values(spots) : null;
});

export const selectSpot = spotId => state => {
    return state?.spots ? state.spots[spotId] : null;
};

const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const spotsState = {};
            action.spots.forEach((spot) => {
                spotsState[spot.id] = spot;
            });
            return spotsState;
        }
        case LOAD_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case ADD_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        default:
            return state;
    }
};

export default spotReducer;
