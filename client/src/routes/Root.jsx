import React from "react";
import { useNavigate } from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md p-8 bg-gray-300 shadow-lg rounded-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to My Expense Tracker</h1>
        <p className="text-gray-700">
          This is a simple website where people can keep a track of their expenses on a daily basis.
        </p>
        <button
          className="mt-4 w-full btn btn-neutral normal-case"
          onClick={() => navigate("/sign-in")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Root;
