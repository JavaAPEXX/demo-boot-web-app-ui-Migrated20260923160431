import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../resources/css/bootstrap.min.css";
import "../../resources/css/common.css";

/**
 * Login page – migrated from src\main\webapp\login.jsp
 * Preserves original Bootstrap layout, form fields, CSRF handling (UNCONFIRMED retrieval),
 * and navigation to the registration page.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [infoMsg, setInfoMsg] = useState<string>("");

  // UNCONFIRMED: obtain CSRF token & parameter name from the page or a cookie.
  const getCsrfToken = (): { paramName: string; token: string } | null => {
    // Example implementations (may need adjustment):
    // 1. From meta tags:
    // const param = document.querySelector('meta[name="_csrf_parameter"]')?.getAttribute('content');
    // const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
    // 2. From cookies (Spring Security default):
    // const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    // if (match) return { paramName: "_csrf", token: decodeURIComponent(match[1]) };
    return null; // <-- currently UNCONFIRMED
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    const csrf = getCsrfToken();

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    if (csrf) {
      params.append(csrf.paramName, csrf.token);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL ?? ""}/login`, {
        method: "POST",
        credentials: "include", // send cookies (session, JSESSIONID)
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        redirect: "manual", // we want to handle redirects ourselves
      });

      // Spring Security typically redirects (302) on success
      if (response.status === 302 || response.redirected) {
        // Follow the redirect location if provided
        const target = response.headers.get("Location") ?? "/welcome";
        navigate(target);
        return;
      }

      // Non‑redirect response – likely a login failure with error/message in body
      const text = await response.text();

      // Simple heuristic: look for known strings from the original JSP
      if (text.includes("Your username and password is invalid")) {
        setErrorMsg("Your username and password is invalid.");
      } else if (text.includes("You have been logged out successfully")) {
        setInfoMsg("You have been logged out successfully.");
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    }
  };

  return (
    <div>
      {/* Main Navigation */}
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark default-color-dark fixed-top">
          <a className="navbar-brand" href="/">
            App Name
          </a>
        </nav>
      </header>

      <div className="container" style={{ marginTop: "80px" }}>
        <form className="form-signin" onSubmit={handleSubmit}>
          <h2 className="form-heading">Log in</h2>

          {/* Message / error display – mirrors JSP ${message} and ${error} */}
          {infoMsg && <div className="alert alert-success">{infoMsg}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className={`form-group ${errorMsg ? "has-error" : ""}`}>
            <input
              name="username"
              type="text"
              className="form-control"
              placeholder="Username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* CSRF hidden field – rendered only if token is available */}
            {(() => {
              const csrf = getCsrfToken();
              return csrf ? (
                <input type="hidden" name={csrf.paramName} value={csrf.token} />
              ) : null;
            })()}
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Log In
            </button>
            <h4 className="text-center">
              <a href="/registration">Create an account</a>
            </h4>
          </div>
        </form>
      </div>

      {/* Scripts – jQuery & Bootstrap JS are not required for React functionality,
          but kept for visual parity if other parts of the app rely on them. */}
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
          <script src={`${process.env.REACT_APP_BASE_URL ?? ""}/resources/js/bootstrap.min.js`}></script> */}
    </div>
  );
};

export default Login;