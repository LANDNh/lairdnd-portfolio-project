import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const user = useSelector(state => state.session.user);

    const sessionLinks = user ? (
        <li className='prof-button'>
            <ProfileButton user={user} />
        </li>
    ) : (
        <>
            <li>
                <OpenModalButton
                    buttonText='Log In'
                    modalComponent={<LoginFormModal />}
                />
            </li>
            <li>
                <OpenModalButton
                    buttonText='Sign Up'
                    modalComponent={<SignupFormModal />}
                />
            </li>
        </>
    );

    return (
        <ul className='navbar'>
            <li className='home-link'>
                <NavLink to="/">Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    );
}

export default Navigation;
