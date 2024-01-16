import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logoutUser());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={toggleMenu}>
                <i className="fas fa-user-circle" />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <li>{user.username}</li>
                        <li>{user.firstName} {user.lastName}</li>
                        <li>{user.email}</li>
                        <li>
                            <button onClick={logout}>Log Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <OpenModalMenuItem
                                itemText="Log In"
                                modalComponent={<LoginFormModal />}
                                onItemClick={closeMenu}
                            />
                        </li>
                        <li>
                            <OpenModalMenuItem
                                itemText="Sign Up"
                                modalComponent={<SignupFormModal />}
                                onItemClick={closeMenu}
                            />
                        </li>
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
