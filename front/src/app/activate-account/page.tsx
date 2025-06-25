'use client'

import { useState, useRef } from 'react';

const BACKEND_URL = "http://localhost:8088"

function ActivationPage() {
    const [codeInput, setCodeInput] = useState(Array(6).fill(''));
    const [message, setMessage] = useState('');
    const [isOkay, setIsOkay] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const inputRefs = useRef([]);

    const handleChange = (index: any, event: any) => {
        const value = event.target.value;

        if (!/^\d?$/.test(value)) {
            return;
        }

        const newCodeInput = [...codeInput];
        newCodeInput[index] = value;
        setCodeInput(newCodeInput);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index: any, event: any) => {
        if (event.key === 'Backspace' && !codeInput[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
        if (event.key === 'Enter' && codeInput.every(Boolean)) {
            handleCodeCompleted(codeInput.join(''));
        }

    };

    const handleCodeCompleted = async (code: any) => {
        try {
            const apiUrl = `${BACKEND_URL}/api/v1/auth/activate-account?token=${code}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setIsOkay(true);
                setMessage('');
            } else {
                setIsOkay(false);

            }
            setSubmitted(true);
        } catch (error) {
            console.error('Activation error:', error);
            setIsOkay(false);
            setMessage('An error occurred. Please try again later.');
            setSubmitted(true);
        }
    };

    const redirectToLogin = () => {
        window.location.href = '/login';
    };

    const handleTryAgain = () => {
        setSubmitted(false);
        setCodeInput(Array(6).fill(''));
    };

    return (
        <div className="container">
            {submitted ? (
                isOkay ? (
                    <div className="activation-message">
                        <h2>Activation Successful!</h2>
                        <p>Your account has been successfully activated.</p>
                        <button className="btn btn-primary" onClick={redirectToLogin}>
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <div className="activation-error">
                        <h2>Activation Failed!</h2>
                        <p>{message}</p>
                        <button className="btn btn-primary" onClick={handleTryAgain}>
                            Try again
                        </button>
                    </div>
                )
            ) : (
                <div className="text-center" style={{ width: '400px' }}>
                    <h2>Type your activation code</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={codeInput[index] || ''}
                                onChange={(event) => handleChange(index, event)}
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                style={{
                                    width: '2em',
                                    textAlign: 'center',
                                    margin: '0.25em',
                                    fontSize: '1.5em',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            />
                        ))}
                    </div>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => handleCodeCompleted(codeInput.join(''))}
                        disabled={!codeInput.every(Boolean)}
                    >
                        Activate
                    </button>
                </div>
            )}
        </div>
    );
}

export default ActivationPage;