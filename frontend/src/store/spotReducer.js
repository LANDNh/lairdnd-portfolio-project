import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const LOAD_SPOTS = 'spot/loadSpots';
const LOAD_SPOT = 'spot/loadSpot';
const ADD_SPOT = 'spot/addSpot';
// const ADD_SPOT_IMAGE = 'spot/addSpotImage'

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

// const addSpotImage = (spotId, spotImage) => {
//     return {
//         type: ADD_SPOT_IMAGE,
//         spotId,
//         spotImage
//     };
// };

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

// export const createSpotImage = (spotId, spotImage) => async dispatch => {
//     const res = await csrfFetch(`api/spots/${spotId}/images`, {
//         method: 'POST',
//         body: JSON.stringify(spotImage)
//     });

//     if (res.ok) {
//         const newImage = await res.json();
//         dispatch(addSpotImage(spotId, newImage));
//         return newImage;
//     }
// }

const selectSpots = state => state?.spots;

export const selectAllSpots = createSelector(selectSpots, spots => {
    return spots ? Object.values(spots) : null;
});

export const selectSpot = spotId => state => {
    return state?.spots ? state.spots[spotId] : null;
};

const intialState = {};

const spotReducer = (state = intialState, action) => {
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
        // case ADD_SPOT_IMAGE:
        //     return {
        //         ...state,
        //         [action.spotId]: {
        //             ...state[action.spotId],
        //             SpotImages: [...state[action.spotId].SpotImages, action.spotImage]
        //         }
        //     }
        default:
            return state;
    }
};

export default spotReducer;
