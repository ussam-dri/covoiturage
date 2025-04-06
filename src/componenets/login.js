import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import Footer from "../utils/Footer";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset previous errors

    try {
      const response = await fetch("http://localhost:5090/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        navigate("/"); // Redirect to home/dashboard
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="ChutChutCar Logo" className="h-10" />
          <div className="space-x-4 font-myFont">
            <a href="/" className="text-blue-600">coDrive</a>
          
          </div>
        </div>
      </nav>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="mt-1 text-center text-4xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-indigo-600"
            />

            <div className="text-right">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-white font-semibold shadow hover:bg-indigo-500 focus:outline-indigo-600"
            >
              Sign in
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Not a member? <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Register</a>
          </p>
        </div>
      </div>
        {/* Bottom row with Terms and Copyright */}
       <Footer></Footer>
    </>
  );
}
