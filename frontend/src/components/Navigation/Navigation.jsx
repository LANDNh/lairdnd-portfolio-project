import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const user = useSelector(state => state.session.user);

    return (
        <ul className='navbar'>
            <li className='home'>
                <NavLink to="/">
                    <img src="../images/lairdnd-name-logo.png" alt="Lair DnD" />
                </NavLink>
            </li>
            {isLoaded && (
                <li className='profile'>
                    {user && (
                        <div className='create-spot'>
                            <NavLink to='/spots/new' style={{ textDecoration: 'none', fontSize: '14pt' }}>
                                <p>
                                    Create a New Spot
                                </p>
                            </NavLink>
                        </div>
                    )}
                    <ProfileButton user={user} />
                </li>
            )}
        </ul>
    );
}

export default Navigation;
