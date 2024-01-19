import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchSpot } from '../../store/spotReducer';
import './SpotDetails.css';

const SpotDetailsPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.spot)

    useEffect(() => {
        dispatch(fetchSpot(spotId));
    }, [dispatch, spotId]);

    return (
        <div className='pseudo-root'>
            <div className='spot-details'>
                <div className='heading'>
                    <h1>{spot.name}</h1>
                    <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
                </div>
                <div className='pictures'>
                    {spot.SpotImages.map(image => {
                        if (image.preview === true) {
                            return (
                                <div className='prev-img-container' key={image.id}>
                                    <img src={image.url} className='preview-image' />
                                </div>
                            )
                        }
                    })}
                    <div className='reg-img-container'>
                        {spot.SpotImages.map(image => {
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
                        <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                        <p>{spot.description}</p>
                    </div>
                    <div className='reserve'>
                        <div className='reserve-price'>
                            <p className='price'>${spot.price}</p>
                            night
                        </div>
                        <div className='review-preview'>
                            <p className='avg-review'>
                                <i className='fas fa-star'></i>
                                {spot.avgStarRating} · {spot.numReviews} reviews
                            </p>
                        </div>
                        <button>Reserve</button>
                    </div>
                </div>
                <div className='spot-reviews'>
                    <h2>
                        <i className='fas fa-star'></i>
                        {spot.avgStarRating} · {spot.numReviews} reviews
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default SpotDetailsPage;
