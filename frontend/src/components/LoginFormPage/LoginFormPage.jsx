import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';

const LoginFormPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    if (user) return <Navigate to='/' replace={true} />;

    const handleSubmit = e => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.userLogin({ credential, password })).catch(
            async res => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        );
    };

    return (
        <div className='login-form'>
            <h1>Log In</h1>
            {errors.credential && <p>{errors.credential}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        placeholder='Username or Email'
                        onChange={e => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="text"
                        value={password}
                        placeholder='Password'
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type='submit'>Log In</button>
            </form>
        </div>
    );
}

export default LoginFormPage;
