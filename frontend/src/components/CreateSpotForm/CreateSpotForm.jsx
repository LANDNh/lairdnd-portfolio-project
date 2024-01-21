import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spotReducer';
import './CreateSpot.css';

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');
    const [img4, setImg4] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        const newSpot = {
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };

        dispatch(createSpot(newSpot));
        navigate(`/spots/${newSpot.id}`);
    };

    if (!user) {
        navigate('/');
    }

    return (
        <div className='create-spot-form'>
            <div className='spot-form-els'>
                <h1>Create a New Spot</h1>
                <div className='set-location outer-container'>
                    <h2>Where&apos;s your place located?</h2>
                    <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>
                    <label className='country'>
                        Country
                        <input
                            type="text"
                            value={country}
                            placeholder='Country'
                            onChange={e => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <label className='address'>
                        Street Address
                        <input
                            type="text"
                            value={address}
                            placeholder='Address'
                            onChange={e => setAddress(e.target.value)}
                            required
                        />
                    </label>
                    <div className='city-state inner-container'>
                        <label className='city'>
                            City
                            <input
                                type="text"
                                value={city}
                                placeholder='City'
                                onChange={e => setCity(e.target.value)}
                                required
                            />
                        </label>
                        <p>,</p>
                        <label className='state'>
                            State
                            <input
                                type="text"
                                value={state}
                                placeholder='State'
                                onChange={e => setState(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className='lat-lng inner-container'>
                        <label className='lat'>
                            Latitude
                            <input
                                type="text"
                                value={lat}
                                placeholder='Latitude'
                                onChange={e => setLat(e.target.value)}
                            />
                        </label>
                        <p>,</p>
                        <label className='lng'>
                            Longitude
                            <input
                                type="text"
                                value={lng}
                                placeholder='Longitude'
                                onChange={e => setLng(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <div className='set-description outer-container'>
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities, and what you love about the neighborhood.</p>
                    <textarea
                        placeholder='Please write at least 30 characters'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className='set-name outer-container'>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <input
                        placeholder='Name of your spot'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className='set-price outer-container'>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <div className='inner-container'>
                        <p>$</p>
                        <input
                            placeholder='Price per night (Silver Pieces)'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='set-photo outer-container'>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                        placeholder='Preview Image URL'
                        value={previewImg}
                        onChange={e => setPreviewImg(e.target.value)}
                        required
                    />
                    <input
                        placeholder='Image URL'
                        value={img1}
                        onChange={e => setImg1(e.target.value)}
                    />
                    <input
                        placeholder='Image URL'
                        value={img2}
                        onChange={e => setImg2(e.target.value)}
                    />
                    <input
                        placeholder='Image URL'
                        value={img3}
                        onChange={e => setImg3(e.target.value)}
                    />
                    <input
                        placeholder='Image URL'
                        value={img4}
                        onChange={e => setImg4(e.target.value)}
                    />
                </div>
                <button>Create Spot</button>
            </div>
        </div>
    )
}

export default CreateSpotForm;
