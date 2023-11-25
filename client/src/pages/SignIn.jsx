import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import "./SignIn.css";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-title">Sign In</h1>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="email"
          placeholder="email"
          className="signin-input"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="signin-input"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading} className="signin-button">
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="signin-link">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span>Sign up</span>
        </Link>
      </div>
      {error && <p className="signin-error">{error}</p>}
    </div>
  );
}
