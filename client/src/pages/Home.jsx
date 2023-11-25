import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

import "./Home.css"; // Import the custom CSS file

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="custom-top-container">
        <h1 className="custom-heading">
          Find your next <span className="custom-highlight">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="custom-description">
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className="custom-link">
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="custom-swiper-slide"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale, and rent */}
      <div className="custom-listing-container">
        {offerListings && offerListings.length > 0 && (
          <div className="custom-listing">
            <div className="custom-heading-secondary">
              <h2 className="custom-subheading">Recent offers</h2>
              <Link className="custom-link-secondary" to={"/search?offer=true"}>
                Show more offers
              </Link>
            </div>
            <div className="custom-list">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="custom-listing">
            <div className="custom-heading-secondary">
              <h2 className="custom-subheading">Recent places for rent</h2>
              <Link className="custom-link-secondary" to={"/search?type=rent"}>
                Show more places for rent
              </Link>
            </div>
            <div className="custom-list">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="custom-listing">
            <div className="custom-heading-secondary">
              <h2 className="custom-subheading">Recent places for sale</h2>
              <Link className="custom-link-secondary" to={"/search?type=sale"}>
                Show more places for sale
              </Link>
            </div>
            <div className="custom-list">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
