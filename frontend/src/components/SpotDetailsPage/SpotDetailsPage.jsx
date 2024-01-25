import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchSpot, selectSpot } from '../../store/spotReducer';
import { fetchSpotReviews } from '../../store/reviewReducer';
import DeleteReviewModal from '../DeleteReviewModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateReviewModal from '../CreateReviewModal';
import './SpotDetails.css';

const SpotDetailsPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const spot = useSelector(selectSpot(spotId));
    const reviews = useSelector(state => state.reviews);

    useEffect(() => {
        dispatch(fetchSpot(spotId));
    }, [dispatch, spotId, reviews]);

    useEffect(() => {
        dispatch(fetchSpotReviews(spotId));
    }, [dispatch, spotId])

    if (!spot) {
        return <div>womp womp</div>
    }

    return (
        <div className='pseudo-root'>
            <div className='spot-details'>
                <div className='heading'>
                    <h1>{spot.name}</h1>
                    <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
                </div>
                <div className='pictures'>
                    {spot.SpotImages?.map(image => {
                        if (image.preview === true) {
                            return (
                                <div className='prev-img-container' key={image.id}>
                                    <img src={image.url} className='preview-image' />
                                </div>
                            )
                        }
                    })}
                    <div className='reg-img-container'>
                        {spot.SpotImages?.map(image => {
                            if (image.preview === false) {
                                return (
                                    <img src={image.url} className='reg-image' key={image.id} />
                                )
                            }
                        })}
                    </div>
                </div>
                <div className='spot-info'>
                    <div className='details'>
                        <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                        <p>{spot.description}</p>
                    </div>
                    <div className='reserve'>
                        <div className='reserve-price'>
                            ${spot.price} night
                        </div>
                        <div className='review-preview'>
                            <p className='avg-review'>
                                <i className='fas fa-star'></i>
                                {spot.avgStarRating || 'New'} {spot.numReviews !== 0 && (
                                    <span>
                                        · {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
                                    </span>
                                )}
                            </p>
                        </div>
                        <button onClick={() => window.alert('Feature Coming Soon...')}>Reserve</button>
                    </div>
                </div>
                <div className='spot-reviews'>
                    <h2>
                        <i className='fas fa-star'></i>
                        {spot.avgStarRating || 'New'} {spot.numReviews !== 0 && (
                            <span>
                                · {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
                            </span>
                        )}
                    </h2>
                    {spotId && spot.ownerId !== user.id && (
                        <button className='new-review'
                            onClick={e => {
                                e.stopPropagation();
                            }}>
                            <OpenModalMenuItem
                                itemText='Post Your Review'
                                modalComponent={<CreateReviewModal spotId={spotId} />}
                            />
                        </button>
                    )}
                    {
                        reviews && Object.values(reviews).length === 0 && spot.ownerId !== user.id ? (
                            <p>Be the first to review!</p>
                        ) : (
                            Object.values(reviews).sort((a, b) => b.id - a.id).map(review => {
                                const date = new Date(review.createdAt);
                                const formatedDate = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                                return (
                                    <div className='review' key={review.id}>
                                        <p className='review-name'>{review.User?.firstName}</p>
                                        <p className='review-date'>{formatedDate}</p>
                                        <p className='review-text'>{review.review}</p>
                                        {review.userId === user.id && (
                                            <div>
                                                <button className='review-delete'
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                    }}>
                                                    <OpenModalMenuItem
                                                        itemText='Delete'
                                                        modalComponent={<DeleteReviewModal review={review} />}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SpotDetailsPage;
