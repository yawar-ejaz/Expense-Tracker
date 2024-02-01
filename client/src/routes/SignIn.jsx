import React from "react";
import { Header } from "../components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { ACTIONS } from "../context/authContext";

function SignIn() {
  const navigate = useNavigate();
  const { handleSubmit, register, reset } = useForm();
  const { dispatch } = useAuthContext();

  const handleSignIn = async (data) => {
    try {
      const result = await axios.post("/auth/sign-in", data);
      const user = {
        name: result.data?.name,
        email: result.data?.email,
        isPremium: result.data.isPremium,
        token: result.data?.token,
      };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: ACTIONS.LOGIN,
        payload: user,
      });
    } catch (error) {
      reset();
      alert(error.response?.data?.message);
    }
  };

  return (
    <>
      <Header
        mainHeading="Sign In"
        sideHeading="One place to manage all your expenses"
      />
      <div className="bg-white p-6 rounded w-full">
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="w-80 mx-auto flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
              autoComplete="off"
              required
              {...register("email")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
              autoComplete="off"
              //   minLength={6}
              maxLength={10}
              required
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 btn btn-neutral normal-case"
          >
            Login
          </button>
        </form>

        <div className="w-80 mx-auto">
          <button
            className="mt-4 w-full btn btn-neutral normal-case"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
        </div>
        <div className="w-80 mx-auto">
          <button
            className="mt-3 w-full  normal-case"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password
          </button>
        </div>
      </div>
    </>
  );
}

export default SignIn;
