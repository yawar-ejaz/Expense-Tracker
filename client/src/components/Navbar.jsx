import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { ACTIONS } from "../context/authContext";
import { LuMenuSquare } from "react-icons/lu";

const Navbar = ({ title = "Title here" }) => {
  const navigate = useNavigate();
  const {
    user: { token, isPremium },
    dispatch,
  } = useAuthContext();

  const buyPremium = async () => {
    try {
      const response = await axios.get("/purchase/premium", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleOpenRazorPay(response.data, token);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  const handleOpenRazorPay = (data, token) => {
    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_KEY,
      name: "Expense Tracker",
      order_id: data.id,
      handler: async function (response) {
        try {
          const result = await axios.post("/premium/verify", response, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (result.data.success) {
            alert("Payment Success");
            dispatch({
              type: ACTIONS.UPGRADE,
            });
          }
        } catch (error) {
          console.log(error);
          alert(error.response?.data?.message);
        }
      },
    };
    const razorpayObject = new window.Razorpay(options);
    razorpayObject.open();
  };

  const logout = () => {
    dispatch({
      type: ACTIONS.LOGOUT,
    });
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <NavLink to="/dashboard" className="text-white my-auto">
              <FaHome className="h-6 w-6" />
            </NavLink>
            <h1 className="text-white text-lg font-bold">{title}</h1>
          </div>
          {/* Desktop Navbar starts */}
          <div className="hidden space-x-4 md:flex">
            {!isPremium && (
              <button
                onClick={buyPremium}
                className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
              >
                Buy Premium
              </button>
            )}
            {isPremium && (
              <>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => navigate("/download-report")}
                  className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
                >
                  Report
                </button>
              </>
            )}
            <button
              onClick={logout}
              className="bg-white text-black px-3 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none"
            >
              Logout
            </button>
          </div>
          {/* Desktop Navbar ends */}
          <div className="md:hidden">
            <div className="drawer drawer-end z-10">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                <label
                  htmlFor="my-drawer"
                  className="bg-gray-800 drawer-button cursor-pointer z-20"
                >
                  <LuMenuSquare className="h-5 w-5 text-white" />
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                />
                <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                  <div className="flex flex-col mt-10  font-semibold">
                    {!isPremium && (
                      <button onClick={buyPremium} className="py-1">
                        Buy Premium
                      </button>
                    )}

                    {isPremium && (
                      <>
                        <button
                          onClick={() => navigate("/leaderboard")}
                          className="py-1"
                        >
                          Leaderboard
                        </button>
                        <button
                          onClick={() => navigate("/download-report")}
                          className="py-1"
                        >
                          Report
                        </button>
                      </>
                    )}
                    <button onClick={logout} className="py-1">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
