const User = require("../models/user")

const addToWishList = async (req, res, next) => {
    if (!req.user) {
        return res.status(404).send("No such user exists!")
    }

    if (!req.query.product_id) {
        return res.status(404).send("No suh product ID Exists!")
    }

    const productID = req.query.product_id
    console.log("Product ID", productID)
    const userID = req.user.id;
    console.log("User ID", userID)
    try {
        const user = await User.findOne({ _id: userID });

        console.log(user)
        if (!user.wishList.includes(productID)) {
            user.wishList.push(productID);
            await user.save()
            return res.status(200).send("Item added successfully");
        }

        else if (user.wishList.includes(productID)) {
            return res.status(200).send("Item is already in wishlist");
        }

        else {
            return res.status(404).send("No such User Exists");
        }
    } catch (err) {
        console.log(err);
    }
    next()
}

const removeFromWishlist = async (req, res, next) => {
    if (!req.user) {
        return res.status(404).send("No such user exists!")
    }

    if (!req.query.product_id) {
        return res.status(404).send("No product ID Given!")
    }

    const productID = req.query.product_id
    console.log("Product ID", productID)
    const userID = req.user.id;
    console.log("User ID", userID)
    try {
        const user = await User.findOne({ _id: userID });


        if (user.wishList.includes(productID)) {
            const index = user.wishList.indexOf(productID);
            user.wishList.splice(index, 1)
            console.log(user)
            await user.save()
            return res.status(200).send("Item Removed successfully");
        }

        else if (!user.wishList.includes(productID)) {
            return res.status(200).send("Item wasnt present in wishlist");
        }

        else {
            return res.status(404).send("No such User Exists");
        }
    } catch (err) {
        console.log(err);
    }
    next()
}

const displayWishList = async (req, res, next) => {
    // Check if the user exists in the request
    if (!req.user) {
        return res.status(404).send("No such user exists");
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
        console.error(err);
        res.status(500).send("An error occurred while fetching the wishlist");
    }

    next();
};


module.exports = { addToWishList, removeFromWishlist, displayWishList };