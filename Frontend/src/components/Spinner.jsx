import ClipLoader from "react-spinners/ClipLoader";

function Spinner(props) {
  const color = "#000000";
  return (
    <div className="sweet-loading">
      <ClipLoader
        color={color}
        // eslint-disable-next-line react/prop-types
        size={props.size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;
