import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
       const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();

        const validateForm = () => {
            if (!username || !password) {
                setError('Username and password are required');
                return false;
            }
            setError('');
            return true;
        };


    
    
        const handleSubmit = async (event) => {
            event.preventDefault();
            if (!validateForm()) return;
            setLoading(true);
    
            const formDetails = new URLSearchParams();
            formDetails.append('username', username);
            formDetails.append('password', password);
    
            try {
                const response = await fetch('http://localhost:8000/api/v1/tokens/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formDetails,
                });
    
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    navigate('/Dashboard');
                } else {
                    const errorData = await response.json();
                    setError(errorData.detail || 'Authentication failed!');
                }
            } catch (error) {
                setError('An error occurred. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
    return (
        <form onSubmit={handleSubmit} className="p-3">
                    

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="form-floating mb-2">
                        <input
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                        <label htmlFor="floatingEmail">Username</label>
                    </div>

                    <div className="form-floating mb-2">
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>


                    <button
                        className="btn btn-primary w-100 py-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
    )
}

export default LoginForm