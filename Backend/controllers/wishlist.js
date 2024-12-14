const User = require("../models/user")

const addToWishList = async (req, res, next) => {
    console.log("Hello Fu");
    if (!req.user) {
        return res.status(404).json({ msg: "Please Login!" })
    }

    if (!req.params.id) {
        return res.status(404).json({ msg: "No product id given!" })
    }

    const productID = req.params.id;
    // console.log("Product ID", productID);
    const userID = req.user.id;
    // console.log("User ID", userID);
    try {
        const user = await User.findOne({ _id: userID });

        // console.log(user)
        if (!user.wishList.includes(productID)) {
            user.wishList.push(productID);
            await user.save()
            return res.status(200).json({ msg: "Item added successfully" });
        }

        else if (user.wishList.includes(productID)) {
            return res.status(200).send({ msg: "Item is already in wishlist" });
        }
    } catch (err) {
        console.log(err);
    }
    next()
}

const removeFromWishlist = async (req, res, next) => {
    if (!req.user) {
        return res.status(404).json({ msg: "Please Login!" })
    }

    if (!req.params.id) {
        return res.status(404).json({ msg: "No product ID given!" })
    }

    const productID = req.params.id
    // console.log("Product ID", productID);
    const userID = req.user.id;
    // console.log("User ID", userID);
    try {
        const user = await User.findOne({ _id: userID });

        if (user.wishList.includes(productID)) {
            const index = user.wishList.indexOf(productID);
            user.wishList.splice(index, 1) // removing the product from the list
            await user.save()
            return res.status(200).json({ msg: "Item Removed successfully" });
        }

        else if (!user.wishList.includes(productID)) {
            return res.status(200).json({ msg: "Item wasnt present in wishlist" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err })
    }
    next()
}

const displayWishList = async (req, res, next) => {
    // Check if the user exists in the request
    if (!req.user) {
        return res.status(404).json({ msg: "Please Login!" })
    }

    const userID = req.user.id;
    console.log(userID)
    try {
        // Query the database for the user document
        const user = await User.findOne({ _id: userID });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // console.log(user);
        res.json({ "wishList": user.wishList }); // Assuming the wishlist is a field in your user schema
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "An error occurred while fetching the wishlist" });
    }
    next();
};


module.exports = { addToWishList, removeFromWishlist, displayWishList };