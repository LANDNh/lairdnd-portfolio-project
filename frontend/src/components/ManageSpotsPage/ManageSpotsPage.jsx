import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSpots, selectAllSpots } from '../../store/spotReducer';
import './ManageSpots.css';

const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const spots = useSelector(selectAllSpots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    const filteredSpots = spots.filter(spot => spot.ownerId === user.id);

    const newSpot = e => {
        e.preventDefault();
        navigate('/spots/new')
    }

    return (
        <>
            <div className='manage-header'>
                <h1>Manage Your Spots</h1>
                <button onClick={newSpot}>Create a New Spot</button>
            </div>
            <div className='landing-page'>
                <ul className='all-tiles'>
                    {spots && filteredSpots.map(spot => (
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
                                    {spot.avgRating?.toFixed(1) || 'New'}
                                </p>
                                <div className='price-per-night'>
                                    <p className='price'>${spot.price}</p>
                                    night
                                </div>
                                <div className='update-delete'>
                                    <button onClick={e => {
                                        e.stopPropagation();
                                        navigate(`/spots/${spot.id}/edit`)
                                    }}>Update</button>
                                    <button>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
};

export default ManageSpotsPage;
