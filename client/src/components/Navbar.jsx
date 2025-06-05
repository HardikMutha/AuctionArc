// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import {
//   Menu,
//   Search,
//   ShoppingBag,
//   Dashboard,
//   AccessTime,
//   History,
//   Close,
//   FavoriteBorder,
//   AlarmOnRounded,
//   Gavel,
// } from "@mui/icons-material";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthContext from "../hooks/useAuthContext";

// const Navbar = (props) => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [scrolled, setScrolled] = useState(false);
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const { state, dispatch } = useAuthContext();
//   const navigate = useNavigate();

//   const auth = {
//     state: {
//       isAuthenticated: state?.isAuthenticated || false,
//       user: state?.user || { username: "User" },
//     },
//   };
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };
//   const menuItems = [
//     {
//       text: "Past Auctions",
//       icon: <History className="text-zinc-100" size={20} />,
//       link: "/past-auctions",
//     },
//     {
//       text: "Start an Auction",
//       icon: <Gavel className="text-zinc-100" size={20} />,
//       link: "/sell-new-product",
//     },
//     {
//       text: "Wishlist",
//       icon: <FavoriteBorder className="text-zinc-100" size={20} />,
//       link: "/wishlist",
//     },
//     {
//       text: "RealTime Auction",
//       icon: <AlarmOnRounded className="text-zinc-100" size={20} />,
//       link: "/live-auction",
//     },
//   ];

//   const mobileMenuItems = [
//     {
//       text: "Past Auctions",
//       icon: <History className="text-black" size={20} />,
//       link: "/past-auctions",
//     },
//     {
//       text: "Sell a Product",
//       icon: <ShoppingBag className="text-black" size={20} />,
//       link: "/sell-new-product",
//     },
//     {
//       text: "Wishlist",
//       icon: <FavoriteBorder className="text-black" size={20} />,
//       link: "/wishlist",
//     },
//     {
//       text: "RealTime Auction",
//       icon: <AccessTime className="text-black" size={20} />,
//       link: "/live-auction",
//     },
//   ];

//   const profileItems = [
//     {
//       text: "Dashboard",
//       icon: <Dashboard className="text-black" size={20} />,
//       link: "/dashboard",
//     },
//   ];

//   const handleLogout = async () => {
//     localStorage.removeItem("token");
//     dispatch({ type: "LOGOUT" });
//     navigate("/");
//   };

//   return (
//     <div className="flex flex-col w-full">
//       <div
//         className={`sticky top-0 z-50 bg-zinc-900 h-[60px] transition-all duration-300 ${
//           scrolled ? "shadow-lg" : ""
//         }`}
//       >
//         <div className="flex items-center justify-between h-full px-2 md:px-4 lg:px-6">
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={handleDrawerToggle}
//               className="p-1 text-zinc-300 focus:outline-none"
//             >
//               <Menu className="text-[#D7431D]" size={24} />
//             </button>
//           </div>

//           <div className="flex items-center">
//             <Link to="/" className="hidden sm:block">
//               <h1 className="font-bold text-lg md:text-xl text-[#D7431D] hover:scale-105 transition-transform duration-300">
//                 AUCTION ARC
//               </h1>
//             </Link>
//           </div>

//           {props?.showSearch === undefined && (
//             <div className="relative flex-grow max-w-xl mx-2 md:mx-4">
//               <div className="flex items-center h-10 bg-zinc-800/50 hover:bg-zinc-800/70 rounded-full transition-colors duration-300">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Search className="text-blue-300" size={18} />
//                 </div>
//                 <input
//                   type="text"
//                   className="w-full h-full pl-10 pr-3 py-2 text-sm text-zinc-200 bg-transparent rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-700"
//                   placeholder="Search auctions..."
//                   value={query}
//                   onChange={(e) => {
//                     setQuery(e.target.value);
//                     if (props.setsearchQuery) {
//                       props.setsearchQuery(e.target.value);
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
//             {auth?.state?.isAuthenticated &&
//               menuItems.map((item) => (
//                 <Link
//                   key={item?.text}
//                   to={item?.link}
//                   className="flex items-center px-2 py-1 text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
//                 >
//                   <span className="mr-1">{item.icon}</span>
//                   <span className="hidden lg:block whitespace-nowrap">
//                     {item.text}
//                   </span>
//                 </Link>
//               ))}
//             {auth?.state?.isAuthenticated ? (
//               <div className="relative ml-2">
//                 <button
//                   className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D7431D] text-white"
//                   onClick={() => setIsLogoutModalOpen(!isLogoutModalOpen)}
//                 >
//                   {auth?.state?.user?.username.charAt(0)}
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isLogoutModalOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//                     <Link
//                       to="/dashboard"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Dashboard
//                     </Link>
//                     <Link
//                       to="/login"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <button
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={async () => {}}
//                       >
//                         Logout
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="ml-2 px-4 py-1 text-zinc-300 border border-[rgba(215,67,29,0.3)] hover:border-[rgba(215,67,29,0.7)] rounded-full transition-all duration-300"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//           <div className="md:hidden">
//             {!auth.state.isAuthenticated && (
//               <Link
//                 to="/login"
//                 className="px-3 py-1 text-sm text-zinc-300 border border-[rgba(215,67,29,0.3)] hover:border-[rgba(215,67,29,0.7)] rounded-full transition-all duration-300"
//               >
//                 Login
//               </Link>
//             )}
//             {auth.state.isAuthenticated && (
//               <button
//                 className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D7431D] text-white"
//                 onClick={() => setIsLogoutModalOpen(!isLogoutModalOpen)}
//               >
//                 {auth?.state?.user?.username.charAt(0)}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-50 bg-black bg-opacity-50"
//           onClick={handleDrawerToggle}
//         >
//           <div
//             className="fixed inset-y-0 left-0 max-w-[300px] w-4/5 bg-white h-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex flex-col h-full">
//               <div className="flex items-center justify-between p-4 border-b">
//                 <Link to="/" className="flex items-center">
//                 <h2 className="font-bold text-lg text-[#D7431D]">
//                   AUCTION ARC
//                 </h2>
//                 </Link>
//                 <button
//                   onClick={handleDrawerToggle}
//                   className="p-1 text-[#D7431D] focus:outline-none"
//                 >
//                   <Close size={24} />
//                 </button>
//               </div>

//               <div className="flex-grow overflow-y-auto p-2">
//                 <div className="space-y-1">
//                   {mobileMenuItems.map((item) => (
//                     <Link
//                       key={item.text}
//                       to={item.link}
//                       className="flex items-center px-3 py-2 rounded-lg hover:bg-[rgba(215,67,29,0.08)] transition-colors duration-300"
//                       onClick={handleDrawerToggle}
//                     >
//                       <span className="mr-3">{item.icon}</span>
//                       <span className="font-medium">{item.text}</span>
//                     </Link>
//                   ))}

//                   {auth.state.isAuthenticated &&
//                     profileItems.map((item) => (
//                       <Link
//                         key={item.text}
//                         to={item.link}
//                         className="flex items-center px-3 py-2 rounded-lg hover:bg-[rgba(215,67,29,0.08)] transition-colors duration-300"
//                         onClick={handleDrawerToggle}
//                       >
//                         <span className="mr-3">{item.icon}</span>
//                         <span className="font-medium">{item.text}</span>
//                       </Link>
//                     ))}
//                 </div>
//               </div>

//               <div className="p-4 border-t">
//                 {auth.state.isAuthenticated ? (
//                   <button
//                     className="w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300"
//                     onClick={() => {
//                       handleDrawerToggle();
//                       handleLogout();
//                     }}
//                   >
//                     Logout
//                   </button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="block w-full py-2 text-center text-white bg-[#D7431D] rounded-lg hover:bg-[#c73a18] transition-colors duration-300"
//                     onClick={handleDrawerToggle}
//                   >
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Navbar;

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingBag,
  Dashboard,
  AccessTime,
  History,
  Close,
  FavoriteBorder,
  AlarmOnRounded,
  Gavel,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Navbar = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const auth = {
    state: {
      isAuthenticated: state?.isAuthenticated || false,
      user: state?.user || { username: "User" },
    },
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const menuItems = [
    {
      text: "Past Auctions",
      icon: <History className="text-zinc-100" size={20} />,
      link: "/past-auctions",
    },
    {
      text: "Start an Auction",
      icon: <Gavel className="text-zinc-100" size={20} />,
      link: "/sell-new-product",
    },
    {
      text: "Wishlist",
      icon: <FavoriteBorder className="text-zinc-100" size={20} />,
      link: "/wishlist",
    },
    {
      text: "RealTime Auction",
      icon: <AlarmOnRounded className="text-zinc-100" size={20} />,
      link: "/live-auction",
    },
  ];

  const mobileMenuItems = [
    {
      text: "Past Auctions",
      icon: <History className="text-black" size={20} />,
      link: "/past-auctions",
    },
    {
      text: "Sell a Product",
      icon: <ShoppingBag className="text-black" size={20} />,
      link: "/sell-new-product",
    },
    {
      text: "Wishlist",
      icon: <FavoriteBorder className="text-black" size={20} />,
      link: "/wishlist",
    },
    {
      text: "RealTime Auction",
      icon: <AccessTime className="text-black" size={20} />,
      link: "/live-auction",
    },
  ];

  const profileItems = [
    {
      text: "Dashboard",
      icon: <Dashboard className="text-black" size={20} />,
      link: "/dashboard",
    },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`sticky top-0 z-50 bg-zinc-900 h-[60px] transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="flex items-center justify-between h-full px-2 md:px-4 lg:px-6">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={handleDrawerToggle}
              className="p-1 text-zinc-300 focus:outline-none"
            >
              <Menu className="text-[#D7431D]" size={24} />
            </button>
          </div>

          {/* Logo - centered on mobile, left on desktop */}
          <div className="flex items-center absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none">
            <Link to="/" className="block">
              <h1 className="font-bold text-lg md:text-xl text-[#D7431D] hover:scale-105 transition-transform duration-300">
                AUCTION ARC
              </h1>
            </Link>
          </div>

          {/* Search bar - hidden on mobile when menu is open */}
          {props?.showSearch === undefined && (
            <div className="relative flex-grow max-w-xl mx-2 md:mx-4 hidden sm:block">
              <div className="flex items-center h-10 bg-zinc-800/50 hover:bg-zinc-800/70 rounded-full transition-colors duration-300">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-blue-300" size={18} />
                </div>
                <input
                  type="text"
                  className="w-full h-full pl-10 pr-3 py-2 text-sm text-zinc-200 bg-transparent rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  placeholder="Search auctions..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (props.setsearchQuery) {
                      props.setsearchQuery(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Desktop menu items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {auth?.state?.isAuthenticated &&
              menuItems.map((item) => (
                <Link
                  key={item?.text}
                  to={item?.link}
                  className="flex items-center px-2 py-1 text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="mr-1">{item.icon}</span>
                  <span className="hidden lg:block whitespace-nowrap">
                    {item.text}
                  </span>
                </Link>
              ))}
            {auth?.state?.isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D7431D] text-white"
                  onClick={() => setIsLogoutModalOpen(!isLogoutModalOpen)}
                >
                  {auth?.state?.user?.username.charAt(0)}
                </button>

                {/* Desktop Dropdown Menu */}
                {isLogoutModalOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsLogoutModalOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-1 text-zinc-300 border border-[rgba(215,67,29,0.3)] hover:border-[rgba(215,67,29,0.7)] rounded-full transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile right side */}
          <div className="md:hidden">
            {!auth.state.isAuthenticated && (
              <Link
                to="/login"
                className="px-3 py-1 text-sm text-zinc-300 border border-[rgba(215,67,29,0.3)] hover:border-[rgba(215,67,29,0.7)] rounded-full transition-all duration-300"
              >
                Login
              </Link>
            )}
            {auth.state.isAuthenticated && (
              <div className="relative">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D7431D] text-white"
                  onClick={() => setIsLogoutModalOpen(!isLogoutModalOpen)}
                >
                  {auth?.state?.user?.username.charAt(0)}
                </button>

                {/* Mobile Dropdown Menu */}
                {isLogoutModalOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsLogoutModalOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}

      {false && (
        <div className="sm:hidden bg-zinc-900 px-2 pb-2">
          <div className="flex items-center h-10 bg-zinc-800/50 hover:bg-zinc-800/70 rounded-full transition-colors duration-300">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-blue-300" size={18} />
            </div>
            <input
              type="text"
              className="w-full h-full pl-10 pr-3 py-2 text-sm text-zinc-200 bg-transparent rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="Search auctions..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (props.setsearchQuery) {
                  props.setsearchQuery(e.target.value);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={handleDrawerToggle}
        >
          <div
            className="fixed inset-y-0 left-0 max-w-[300px] w-4/5 bg-white h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <Link
                  to="/"
                  className="flex items-center"
                  onClick={handleDrawerToggle}
                >
                  <h2 className="font-bold text-lg text-[#D7431D]">
                    AUCTION ARC
                  </h2>
                </Link>
                <button
                  onClick={handleDrawerToggle}
                  className="p-1 text-[#D7431D] focus:outline-none"
                >
                  <Close size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-2">
                <div className="space-y-1">
                  {mobileMenuItems.map((item) => (
                    <Link
                      key={item.text}
                      to={item.link}
                      className="flex items-center px-3 py-2 rounded-lg hover:bg-[rgba(215,67,29,0.08)] transition-colors duration-300"
                      onClick={handleDrawerToggle}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium">{item.text}</span>
                    </Link>
                  ))}

                  {auth.state.isAuthenticated &&
                    profileItems.map((item) => (
                      <Link
                        key={item.text}
                        to={item.link}
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-[rgba(215,67,29,0.08)] transition-colors duration-300"
                        onClick={handleDrawerToggle}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.text}</span>
                      </Link>
                    ))}
                </div>
              </div>

              <div className="p-4 border-t">
                {auth.state.isAuthenticated ? (
                  <button
                    className="w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    onClick={() => {
                      handleDrawerToggle();
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full py-2 text-center text-white bg-[#D7431D] rounded-lg hover:bg-[#c73a18] transition-colors duration-300"
                    onClick={handleDrawerToggle}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
