import React from "react";

function PlaceBidPopup(props) {

    return (props.trigger) ? (

        <div style = {{position : "absolute", width : "100%", height : "100vh", zIndex : "100000000", backgroundColor : "white"}}>
            <h3>
                This is a popup
            </h3>
            <button onClick = {() => {props.setBidPopup(false) }}> close </button>
            { props.children }
        </div>
    ) : ""
}

export default PlaceBidPopup;