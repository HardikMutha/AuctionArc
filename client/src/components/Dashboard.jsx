/* eslint-disable react/prop-types */

import Navbar from "./Navbar";
import DisplayInfoToggle from "./ui/DisplayInfoToggle";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ data }) => {
  const [userBids, setUserBids] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/get-user-bids/`,
          {
            withCredentials: true,
          }
        );
        console.log("Ongoing bidS ", response.data.data);
        setUserBids([...response.data.data]);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <Navbar />
      <h1 className="pt-20 md:text-5xl font-bold text-center text-3xl mb-10">
        Welcome to {data.username}&apos;s Dashboard
      </h1>
      <DisplayInfoToggle type={"My Listed Products"} state={true} />
      <DisplayInfoToggle type={"My Bids"} userBids={userBids} />
    </div>
  );
};

export default Dashboard;
