import React from "react";
import { Header } from "../components";
import { useForm } from "react-hook-form";
import axios from "axios";

const ForgotPassword = () => {
  const { handleSubmit, register, reset } = useForm();

  const handlePasswordReset = async (data) => {
    reset();
    try {
      const response = await axios.post("/auth/get-otp", data);
      alert(response?.data?.message);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  return (
    <>
      <Header
        mainHeading="No worries."
        sideHeading="Enter the email id linked to your account"
      />
      <div className="bg-white p-6 rounded w-full">
        <form
          onSubmit={handleSubmit(handlePasswordReset)}
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
          <button
            type="submit"
            className="w-full mt-4 btn btn-neutral normal-case"
          >
            Get Verification link
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
