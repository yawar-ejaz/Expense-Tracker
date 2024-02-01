import React from "react";
import { Header } from "../components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { ACTIONS } from "../context/authContext";

function SignUp() {
  const navigate = useNavigate();
  const { handleSubmit, register, reset } = useForm();
  const { dispatch } = useAuthContext();

  const handleSignUp = async (data) => {
    try {
      const result = await axios.post("/auth/sign-up", data);

      const user = {
        name: result.data?.name,
        email: result.data?.email,
        isPremium: result.data.isPremium,
        token: result.data?.token,
      };
      dispatch({
        type: ACTIONS.LOGIN,
        payload: user,
      });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
    reset();
  };

  return (
    <>
      <Header mainHeading="Sign Up" sideHeading="Create an account with us" />

      <div className="bg-white p-6 rounded shadow-md w-full ">
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="flex flex-col gap-4 w-80 mx-auto"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 w-full border rounded-md text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
              required
              autoComplete="off"
              {...register("name")}
            />
          </div>
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
              required
              autoComplete="off"
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
              required
              autoComplete="off"
              //   minLength={6}
              maxLength={10}
              {...register("password")}
            />
          </div>

          <button type="submit" className="w-full btn btn-neutral normal-case">
            Create Account
          </button>
        </form>
        <div className="w-80 mx-auto">
          <button
            className="mt-4 w-full btn btn-neutral normal-case"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUp;
