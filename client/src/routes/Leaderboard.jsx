import { useEffect, useState } from "react";
import { LeaderboardTable, Navbar } from "../components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const showLeaderboard = async () => {
          const { token } = JSON.parse(localStorage.getItem("user"));
          try {
            const response = await axios.get("/premium/leaderboard", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setAccounts(response.data);
          } catch (error) {
              console.log(error);
              alert(error.response?.data?.message);
              navigate("/dashboard");
          }
        };
        showLeaderboard();
    }, []);
  
  return (
    <>
      <Navbar title="Leaderboard" />
      <LeaderboardTable accounts={accounts} />
    </>
  );
};

export default Leaderboard;
