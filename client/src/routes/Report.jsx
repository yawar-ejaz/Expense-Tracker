import React from "react";
import { Navbar } from "../components";
import { useForm } from "react-hook-form";

import axios from "axios";


const Report = () => {
  const { handleSubmit, register, reset } = useForm();
    const getReport = async (data) => {
        const { token } = JSON.parse(localStorage.getItem("user"));
        try {
            const result = await axios.get(`/premium/report?type=${data.type}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (result?.data?.success == false) {
                alert(result?.data?.message);
            }
            else {
                const url = result?.data?.url;
                const a = document.createElement("a");
                a.href = url;
                a.click();
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message);
        }
  };

  return (
    <>
      <Navbar title="Download Report" />
      <div className="card w-[90%] md:w-[60%] lg:w-[40%] max-w-md bg-base-100 mt-2 mb-5 shadow-md mx-auto sm:w-[75%]">
        <form onSubmit={handleSubmit(getReport)} className="card-body">
          <div className="grid grid-cols-1">
            <label htmlFor="type">Download report for</label>
            <select
              className="mt-1 select select-bordered w-full"
              name="type"
              {...register("type")}
            >
              <option value="monthly">Last Month</option>
              <option value="yearly">Last Year</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 btn btn-neutral normal-case"
          >
            Download
          </button>
        </form>
      </div>
    </>
  );
};

export default Report;
