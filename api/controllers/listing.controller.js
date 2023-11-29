import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


// Controller to create a new listing
export const createListing = async (req, res, next) => {
  try {
    // Creating a new listing using data from the request body
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Controller to delete a listing
export const deleteListing = async (req, res, next) => {
  // Finding the listing by its ID
  const listing = await Listing.findById(req.params.id);


   // Handling case where the listing is not found
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }


  // Checking if the authenticated user is the owner of the listing
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }
  try {
    // Deleting the listing from the database
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};




export const updateListing = async (req, res, next) => {
  try {
    // Find the listing by ID
    const listing = await Listing.findById(req.params.id);

    // Check if the listing exists
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Check if the user is authorized to update the listing
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    // Update the listing with the new data
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};


// Controller to get a specific listing by ID
export const getListing = async (req, res, next) => {
  try {
    // Finding the listing by its ID
    const listing = await Listing.findById(req.params.id);
    // Handling case where the listing is not found
    if(!listing) {
      return next(errorHandler(404, 'Lisiting not found!'));
    }
     // Sending a success response with the retrieved listing
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}


export const getListings = async (req, res, nexr) => {
  try {
    // Parsing query parameters for pagination, filtering, and sorting
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    // Handling default and custom filtering options
    if(offer === undefined || offer === 'false'){
      offer = {$in: [false, true]};
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false') {
      furnished ={$in: [false, true] };
    }

    let parking = req.query.parking;

    if(parking === undefined || parking === 'false'){
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === 'all'){
      type = {$in: ['sale', 'rent' ] };
    }

    // Handling search term for filtering by name
    const searchTerm = req.query.searchTerm || '';

     // Sorting and ordering options for the query
    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    // Querying the database based on filter options
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    }).sort(
      {[sort]: order}
    ).limit(limit).skip(startIndex);

    return res.status(200).json(listings);


  } catch (error) {
    next(error)
  }
}