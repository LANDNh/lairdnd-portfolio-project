import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'review/loadReviews';
const LOAD_SPOT_REVIEWS = 'review/loadSpotReviews';
const ADD_REVIEW = 'review/addReview';
const DELETE_REVIEW = 'review/deleteReview';

const loadReviews = reviews => {
    return {
        type: LOAD_REVIEWS,
        reviews
    };
};

const loadSpotReviews = reviews => {
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews
    };
};

const addReview = review => {
    return {
        type: ADD_REVIEW,
        review
    };
};

const deleteReview = reviewId => {
    return {
        type: DELETE_REVIEW,
        reviewId
    };
};

export const fetchReviews = () => async dispatch => {
    const res = await csrfFetch('/api/reviews/current');

    if (res.ok) {
        const data = await res.json();
        dispatch(loadReviews(data.Reviews));
        return data;
    }
};

export const fetchSpotReviews = spotId => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpotReviews(data.Reviews));
        return data;
    }
}

export const createReview = (spotId, review) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    });

    if (res.ok) {
        const newReview = await res.json();
        dispatch(addReview(newReview));
        return newReview;
    }
};

export const removeReview = reviewId => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(deleteReview(reviewId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const reviewsState = {};
            action.reviews.forEach(review => {
                reviewsState[review.id] = review;
            });
            return reviewsState;
        }
        case LOAD_SPOT_REVIEWS: {
            const reviewsState = {};
            action.reviews.forEach(review => {
                reviewsState[review.id] = review;
            });
            return reviewsState;
        }
        case ADD_REVIEW:
            return { ...state, [action.review.id]: action.review }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState[action.reviewId];
            return newState;
        }
        default:
            return state;
    }
};

export default reviewReducer;
