const SET_REVIEW_SUBMITTED = 'SET_REVIEW_SUBMITTED';

export const setReviewSubmitted = value => ({
    type: SET_REVIEW_SUBMITTED,
    value,
});

const reviewSubmittedReducer = (state = false, action) => {
    switch (action.type) {
        case SET_REVIEW_SUBMITTED:
            return action.value;
        default:
            return state;
    }
};

export default reviewSubmittedReducer;
