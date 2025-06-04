import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "../components/Navbar";
import useAuthContext from "../hooks/useAuthContext";

export default function SellAProduct() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    startDate: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/product/add-newproduct`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${state?.token}`,
          },
        }
      );
      toast.success(response.data.msg);
      setLoading(false);
      navigate(`/products/${response.data.id}`);
    } catch (err) {
      console.log(err.response.data);
      if (err.response?.status == 409) {
        toast.error(err.response.data.message);
      } else toast.error("An Error Occured Please try again");
      setLoading(false);
    }
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Books",
    "Sports",
    "Car",
    "Other",
  ];

  function disablePastDates() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }
  const currentDate = disablePastDates();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Navbar showSearch={false} />
      <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl pb-3 font-semibold">Auction Arc</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-cyan-200 p-6 space-y-6 border-[1px] border-cyan-500">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                New Product Listing
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the details to create your product listing
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  name="name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your product..."
                  name="description"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Images
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          id="images"
                          name="images"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="group aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  name="category"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Listing Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    name="listingPrice"
                    step="0.1"
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    min={currentDate}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    name="duration"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Create Listing
                </button>
                <div className="flex justify-center">
                  <button
                    className="border-2 p-2 mt-5 border-black rounded-lg font-semibold text-sm"
                    onClick={() => {
                      navigate("/");
                    }}
                    type="button"
                  >
                    <IoArrowBack
                      size={"1.2rem"}
                      style={{
                        display: "inline",
                        marginRight: "2px",
                      }}
                    />
                    Go Back
                  </button>
                </div>
              </div>
            </form>
            {loading ? <Spinner /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
