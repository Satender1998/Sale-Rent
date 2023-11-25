import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

import "./ListingItem.css";

export default function ListingItem({ listing }) {
  return (
    <div className="listing-item">
      <Link to={`/listing/${listing._id}`} className="listing-link">
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="listing-image"
        />
        <div className="listing-details">
          <p className="listing-name">{listing.name}</p>
          <div className="location-container">
            <MdLocationOn className="location-icon" />
            <p className="location-text">{listing.address}</p>
          </div>
          <p className="description">{listing.description}</p>
          <p className="price">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="features">
            <div className="feature">
              {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
            </div>
            <div className="feature">
              {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
