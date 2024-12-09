import "../styles/NewProduct.css";
const NewProduct = () => {
  const handleSubmit = (evt: object) => {
    console.log(evt);
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
            onSubmit={(evt) => {
              evt.preventDefault();
              handleSubmit(evt);
            }}
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
            <button typeof="Submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
