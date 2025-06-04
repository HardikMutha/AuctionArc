/* eslint-disable react/prop-types */
import { useState } from "react";
import DashboardTable from "./DashboardTable";
import UserBidsComponent from "./UserBidsComponent";

const DisplayInfoToggle = (props) => {
  const [isExpanded, setIsExpanded] = useState(props?.state);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="border-[#ddd] border-[1px] lg:w-[80%] rounded-lg mx-auto my-[20px] w-[100%] shadow-lg shadow-cyan-400/20 hover:shadow-xl hover:shadow-cyan-500/20 px-4">
      <div
        onClick={toggleExpand}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "25px 30px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        <span className="md:text-3xl font-semibold text-xl">{props?.type}</span>
        <span
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s",
          }}
        >
          ▼
        </span>
      </div>
      {isExpanded && (
        <div
          style={{
            padding: "2px 2px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
          }}
        >
          {!(props?.type === "My Bids") ? (
            <DashboardTable />
          ) : (
            <UserBidsComponent userBids={props?.userBids} />
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayInfoToggle;
