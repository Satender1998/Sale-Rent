import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Contact.css";

export default function Contact({ listing }) {
  // State to store landlord information
  const [landlord, setLandlord] = useState(null);
  // State to store user input message
  const [message, setMessage] = useState("");

  // Function to handle input change in the message textarea
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // Effect to fetch landlord information when the component mounts or when listing.userRef changes
  useEffect(() => {
    // Function to fetch landlord information
    const fetchLandlord = async () => {
      try {
        // Make a GET request to the server API to fetch user information based on userRef
        const response = await fetch(`/api/user/${listing.userRef}`);

        // Parse the JSON response
        const data = await response.json();

        // Update the landlord state with the fetched data
        setLandlord(data);
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error("Error fetching landlord information:", error);
      }
    };
    // Call the fetchLandlord function
    fetchLandlord();
    // Specify the dependency array to trigger the effect when listing.userRef changes
  }, [listing.userRef]);

  return (
    <>
      {/* Display contact information if landlord data is available */}
      {landlord && (
        <div className="contact-container">
          <p>
            Contact{" "}
            <span className="contact-username">{landlord.username}</span> for{" "}
            <span className="contact-listing-name">
              {listing.name.toLowerCase()}
            </span>
          </p>
          {/* Textarea for users to enter their messages */}
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="contact-textarea"
          ></textarea>
          {/* Link to open the default email client with a pre-filled message */}
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="contact-link"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
