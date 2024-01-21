import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSpots, selectAllSpots } from '../../store/spotReducer';
import './SpotsList.css';

const SpotsListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = useSelector(selectAllSpots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <div className='landing-page'>
            <ul className='all-tiles'>
                {spots && spots.map(spot => (
                    <div
                        className='spot-tile'
                        onClick={() => {
                            navigate(`/spots/${spot.id}`)
                        }}
                        key={spot.id}
                    >
                        <div className='spot-prev'>
                            <p className='tooltip'>{spot.name}</p>
                            <img src={spot.previewImage}
                                alt={spot.name}
                                className='spot-img'
                            />
                        </div>
                        <div className='tile-info'>
                            <p>{spot.city}, {spot.state}</p>
                            <p className='spot-rating'>
                                <i className='fas fa-star'></i>
                                {spot.avgRating?.toFixed(1)}
                            </p>
                            <div className='price-per-night'>
                                <p className='price'>${spot.price}</p>
                                night
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default SpotsListPage;
