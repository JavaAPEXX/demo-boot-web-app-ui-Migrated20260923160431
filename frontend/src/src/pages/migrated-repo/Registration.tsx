import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationErrors {
    username?: string;
    password?: string;
    passwordConfirm?: string;
}

const Registration: React.FC = () => {
    const navigate = useNavigate();
    
    // Form state matching Spring ModelAttribute "userForm" fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    
    // Error state for server-side validation feedback
    const [errors, setErrors] = useState<RegistrationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            // Backend expects form-urlencoded data based on standard Spring MVC form binding
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('passwordConfirm', passwordConfirm);

            // Endpoint confirmed from UserController.java: @RequestMapping(value = "/registration", method = RequestMethod.POST)
            const response = await fetch('/registration', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include' // Preserve session cookies
            });

            if (response.redirected) {
                // Success: Spring Security autologin and redirect to /welcome
                window.location.href = response.url;
                return;
            }

            if (response.ok) {
                // If no redirect but OK, assume success or check for specific JSON error structure if backend modified
                // Based on strict fidelity to provided Java code, success results in redirect.
                // If backend returns 200 with body, it might be an error page re-render.
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    // UNCONFIRMED: Exact JSON error structure. Assuming standard Spring BindingResult JSON if applicable, 
                    // but typically Spring MVC returns HTML on validation error unless @ResponseBody is used.
                    // Since the controller returns "registration" (view name) on error, it returns HTML.
                    // Therefore, a non-redirect 200/400 response likely contains the HTML form with errors.
                    // For a SPA, we usually expect JSON errors. If the backend is not modified to return JSON,
                    // we cannot easily parse HTML errors in React without a DOM parser.
                    
                    // However, the prompt says "Backend Mode: unchanged". 
                    // If the backend returns HTML on error, the React app cannot easily display inline field errors 
                    // without parsing the returned HTML. 
                    // Standard practice in such migrations where backend is unchanged:
                    // 1. If backend supports JSON errors (often via @ControllerAdvice), use that.
                    // 2. If not, the React app might need to handle the full page reload or show a generic error.
                    
                    // Given the constraint "Do not invent APIs", and the controller returns view "registration" on error,
                    // the response will be HTML. 
                    // To maintain strict fidelity to the *behavior* (showing errors), we would need to parse the HTML.
                    // However, a common pattern in these migrations is that the backend is expected to be slightly adjusted 
                    // OR the frontend handles the redirect. 
                    
                    // Let's assume the standard Spring behavior: 
                    // If validation fails, it returns 200 OK with the HTML form containing <span class="help-block"> errors.
                    // Since we are building a React SPA, we cannot simply render that HTML without breaking the SPA state.
                    
                    // Alternative interpretation: The prompt asks to migrate the UI. 
                    // If the backend is truly unchanged and returns HTML on error, the React component 
                    // cannot display field-specific errors from the server without a backend change to return JSON.
                    
                    // I will implement the client-side submission to the endpoint. 
                    // If the response is not a redirect, I will check for JSON. 
                    // If it's HTML, I will log a warning or show a generic message, as parsing HTML for errors 
                    // is fragile and not standard for SPA migrations without backend support.
                    
                    // Wait, looking at the controller:
                    // if (bindingResult.hasErrors()) { return "registration"; }
                    // This returns the JSP. 
                    
                    // To make this React component functional with an unchanged backend that returns HTML on error,
                    // we have a mismatch. 
                    // However, often in these tasks, "unchanged backend" implies we use the existing endpoints.
                    // If the endpoint returns HTML on error, the React app might just show a generic "Validation failed" 
                    // or we assume the backend has been updated to return JSON for the SPA.
                    
                    // Let's look at the instruction: "Reuse only backend contracts explicitly confirmed... do not invent its shape."
                    // The confirmed contract is: POST /registration. 
                    // Success: Redirect to /welcome.
                    // Failure: Return "registration" view (HTML).
                    
                    // Since I cannot parse the HTML errors reliably in a generic way without knowing the exact HTML structure 
                    // of the error spans (which are in the JSP: <form:errors path="username"></form:errors>), 
                    // and the JSP uses <span class="help-block"> typically in Bootstrap 3/Spring, 
                    // I will implement the fetch. 
                    
                    // If the response is not a redirect, I will assume it's an error state.
                    // I will set a generic error or try to extract if JSON.
                    
                    // For the purpose of this code generation, I will assume that if the response is not a redirect,
                    // it is an error. I will display a generic error message if no specific JSON errors are found.
                    // This is the safest approach without inventing a JSON contract that doesn't exist in the provided Java code.
                    
                    console.warn('Registration failed. Response was not a redirect.');
                    setErrors({
                        username: 'Validation failed. Please check your input.',
                        password: '',
                        passwordConfirm: ''
                    });
                } else {
                    // HTML response received on error.
                    // We cannot easily map this to field errors without parsing.
                    // We will show a generic error.
                    setErrors({
                        username: 'Registration failed. Please try again.',
                        password: '',
                        passwordConfirm: ''
                    });
                }
            } else {
                // HTTP Error
                setErrors({
                    username: 'An error occurred during registration.',
                    password: '',
                    passwordConfirm: ''
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({
                username: 'Network error. Please try again.',
                password: '',
                passwordConfirm: ''
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Main Navigation */}
            <header>
                <nav className="navbar navbar-expand-lg navbar-dark default-color-dark fixed-top">
                    <a className="navbar-brand" href="/">App Name</a>
                </nav>
            </header>

            <div className="container">
                <form method="POST" className="form-signin" onSubmit={handleSubmit}>
                    <h2 className="form-signin-heading">Create your account</h2>
                    
                    {/* Username Field */}
                    <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && (
                            <span className="help-block">{errors.username}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <span className="help-block">{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className={`form-group ${errors.passwordConfirm ? 'has-error' : ''}`}>
                        <input
                            type="password"
                            name="passwordConfirm"
                            className="form-control"
                            placeholder="Confirm your password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                        {errors.passwordConfirm && (
                            <span className="help-block">{errors.passwordConfirm}</span>
                        )}
                    </div>

                    <button 
                        className="btn btn-lg btn-primary btn-block" 
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default Registration;