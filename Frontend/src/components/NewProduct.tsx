import "../styles/NewProduct.css";
import axios from "axios";
const NewProduct = () => {
  const handleSubmit = (evt: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any;
    preventDefault: () => void;
  }) => {
    evt.preventDefault();
    const productDetails = {
      name: evt.target[0].value,
      description: evt.target[1].value,
      images: evt.target[2].value,
      category: evt.target[3].value,
      listingPrice: parseFloat(evt.target[4].value),
      duration: new Date(),
      productSeller: "6757231c22b9b895928c3a7b",
      bidHistory: parseFloat(evt.target[4].value),
    };
    const addData = async () => {
      try {
        await axios.post(
          "http://localhost:3000/add-newproduct",
          productDetails
        );
      } catch (err) {
        console.log(err);
      }
    };
    addData();
  };
  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl">Add New Product</h1>
        <div className="border-2  rounded-md mt-6">
          <form
            action="/add-newproduct"
            method="post"
            className="flex flex-col p-4 px-4"
            onSubmit={handleSubmit}
          >
            <input type="text" placeholder="Name" name="name" className="m-2" />
            <input
              type="text"
              name="description"
              placeholder="description"
              className="m-2"
            />
            <input type="url" name="images" placeholder="url" className="m-2" />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="m-2"
            />
            <input
              type="number"
              name="images"
              placeholder="Listing-Price"
              className="m-2"
            />
            <input
              type="date"
              name="duration"
              placeholder="Duration"
              className="m-2"
            />
            <button className="border-2 p-2 font-semibold">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
