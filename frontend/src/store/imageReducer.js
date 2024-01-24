import { csrfFetch } from "./csrf";

const ADD_SPOT_IMAGE = 'image/addSpotImage';

const addSpotImage = image => {
    return {
        type: ADD_SPOT_IMAGE,
        image
    };
};

export const createSpotImage = (spotId, image) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify(image)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addSpotImage(data));
        return data;
    }
};

const initialState = {};

const imageReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SPOT_IMAGE:
            return { ...state, [action.spotId]: { ...state[action.spotId], SpotImages: action.image } }
        default:
            return state;
    }
};

export default imageReducer;
