/* eslint-disable react/prop-types */

import Navbar from "./Navbar";

const Wishlist = ({ data }) => {
  return (
    <div>
      <Navbar showSearch={false} />
      <h1 className="pt-20 md:text-5xl font-bold text-center text-3xl mb-10">
        Welcome to {data.username}&apos;s Wishlist
      </h1>
    </div>
  );
};

export default Wishlist;
