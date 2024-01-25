import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/reviewReducer';
import './CreateReview.css';
import { setReviewSubmitted } from '../../store/reviewSubmitted';

const Star = ({ selected, onClick }) => (
    <span className={selected ? 'star selected' : 'star'} onClick={onClick}>
        <i className='fas fa-star'></i>
    </span>
)

const CreateReviewModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = e => {
        e.preventDefault();
        setErrors({});

        const newReview = {
            userId: user.id,
            spotId: spotId,
            review,
            stars
        }

        return dispatch(createReview(spotId, newReview))
            .then(() => {
                dispatch(setReviewSubmitted(true));
            })
            .then(closeModal)
            .catch(async res => {
                const data = await res.json();
                if (data && data?.message) {
                    setErrors({ message: data?.message });
                }
            });
    };

    const handleRating = (rate) => {
        setStars(rate);
    };

    const disableReview = {};
    if (!review ||
        review.length < 10 ||
        !stars ||
        stars < 1) {
        disableReview.disabled = true;
    } else {
        disableReview.disabled = false;
    }

    return (
        <div className='review-form'>
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit}>
                <span>
                    {errors.message && <p className='review-error'>{errors.message}</p>}
                </span>
                <textarea
                    className='review-input'
                    placeholder='Leave a review!'
                    value={review}
                    onChange={e => setReview(e.target.value)}
                ></textarea>
                <span>
                    <div className='star-rating'>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                selected={star <= stars}
                                onClick={() => handleRating(star)}
                            />
                        ))}
                        Stars
                    </div>
                </span>
                <button className='submit-review' {...disableReview}>Submit Review</button>
            </form>
        </div>
    )
};

export default CreateReviewModal;
