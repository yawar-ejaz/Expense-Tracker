import React, { useEffect, useState } from "react";
import { Header } from "../components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, reset } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState(false);
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.post(`/auth/verify-token`, { token });
        if (data?.success) {
          setShowForm(true);
        } else {
          setError(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyToken();
  }, [token]);

  if (!token) {
    return <Navigate to="/" />;
  }

  const handlePasswordReset = async (data) => {
    try {
      const result = await axios.post("/auth/reset-password", {
        ...data,
        token,
      });
      if (result?.data?.success) {
        alert("password reset successful");
        navigate("/sign-in");
      } else {
        alert("password reset failed");
        navigate("/forgot-password");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
    reset();
  };

  if (error) {
    return <h1>Invalid Token</h1>;
  }

  if (showForm) {
    return (
      <>
        <Header mainHeading="Reset password" sideHeading="Enter new password" />
        <div className="bg-white p-6 rounded w-full">
          <form
            onSubmit={handleSubmit(handlePasswordReset)}
            className="w-80 mx-auto flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                New Password
              </label>
              <input
                type="password"
                name="password"
                className="mt-1 p-2 w-full border rounded-md text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
                autoComplete="off"
                required
                {...register("password")}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 btn btn-neutral normal-case"
            >
              Set Password
            </button>
          </form>
        </div>
      </>
    );
  } else {
    return <h1>Invalid Token</h1>;
  }
};

export default ResetPassword;
