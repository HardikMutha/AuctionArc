/* eslint-disable react/prop-types */

import Navbar from "./Navbar";
import DisplayInfoToggle from "./ui/DisplayInfoToggle";

const Dashboard = ({ data }) => {
  return (
    <div className="p-4">
      <Navbar />
      <h1 className="mt-[8%] md:text-5xl font-bold text-center text-3xl mb-5">
        Welcome to {data.username}&apos;s Dashboard
      </h1>
      <DisplayInfoToggle type={"My Listed Products"} state={true} />
      <DisplayInfoToggle type={"My Bids"} />
    </div>
  );
};

export default Dashboard;
