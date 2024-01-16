import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

const LoginFormModal = () => {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = e => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.userLogin({ credential, password }))
            .then(closeModal)
            .catch(async res => {
                const data = await res.json();
                if (data && data?.errors) setErrors(data.errors);
            });
    };

    return (
        <div className='login-form'>
            <h1>Log In</h1>
            {errors.credential && <p>{errors.credential}</p>}
            <form onSubmit={handleSubmit}>
                <span>
                    <input
                        type="text"
                        value={credential}
                        placeholder='Username or Email'
                        onChange={e => setCredential(e.target.value)}
                        required
                    />
                </span>
                <span>
                    <input
                        type="text"
                        value={password}
                        placeholder='Password'
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </span>
                <span>
                    <button type='submit'>Log In</button>
                </span>
            </form >
        </div >
    );
}

export default LoginFormModal;
