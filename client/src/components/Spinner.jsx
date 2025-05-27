/* eslint-disable react/prop-types */
const Spinner = ({ size = 60 }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div
          className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"
          style={{ width: size, height: size }}
        ></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
