import React, { useEffect } from "react";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import './UpdateListing.css';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 800,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      // console.log(listingId);
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);
  //   console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed 2 mb per image");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  console.log(files);
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="main-container">
      <h1 className="Heading-text">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="update-listing-form-container">
        <div className="update-listing-input-container">
          <input
            type="text"
            placeholder="Name"
            className="update-listing-input"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>
        <div className="update-listing-input-container">
          <textarea
            type="text"
            placeholder="Description"
            className="update-listing-textarea"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
        </div>
        <div className="update-listing-input-container">
          <input
            type="text"
            placeholder="Address"
            className="update-listing-input"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
        </div>
        <div className="update-listing-checkbox-group">
          <div className="update-listing-checkbox-container">
            <input
              type="checkbox"
              id="sale"
              className="update-listing-checkbox"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <label className="update-listing-checkbox-label">Sell</label>
          </div>
          <div className="update-listing-checkbox-container">
            <input
              type="checkbox"
              id="rent"
              className="update-listing-checkbox"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <label className="update-listing-checkbox-label">Rent</label>
          </div>
          <div className="update-listing-checkbox-container">
            <input
              type="checkbox"
              id="parking"
              className="update-listing-checkbox"
              onChange={handleChange}
              checked={formData.parking}
            />
            <label className="update-listing-checkbox-label">
              Parking spot
            </label>
          </div>
          <div className="update-listing-checkbox-container">
            <input
              type="checkbox"
              id="furnished"
              className="update-listing-checkbox"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <label className="update-listing-checkbox-label">Furnished</label>
          </div>
          <div className="update-listing-checkbox-container">
            <input
              type="checkbox"
              id="offer"
              className="update-listing-checkbox"
              onChange={handleChange}
              checked={formData.offer}
            />
            <label className="update-listing-checkbox-label">Offer</label>
          </div>
        </div>



        <div className="update-listing-beds-baths">
          <div className="update-listing-beds">
            <input
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              className="update-listing-number-input"
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <p className="update-listing-number-label">Beds</p>
          </div>
          <div className="update-listing-baths">
            <input
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              className="update-listing-number-input"
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <p className="update-listing-number-label">Baths</p>
          </div>
          <div className="update-listing-regular-price">
            <input
              type="number"
              id="regularPrice"
              min="800"
              max="10000"
              required
              className="update-listing-regular-price-input"
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <div className="update-listing-regular-price-label">
              <p>Regular price</p>
              <span className="text-xs">($ / month)</span>
            </div>
          </div>
          {formData.offer && (
            <div className="update-listing-discount-price">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="1000"
                required
                className="update-listing-discount-price-input"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="update-listing-discount-price-label">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          )}
        </div>
        {/* <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              className="update-listing-number-input"
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <p className="update-listing-number-label">Beds</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              className="update-listing-number-input"
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <p className="update-listing-number-label">Baths</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="regularPrice"
              min="800"
              max="10000"
              required
              className="update-listing-regular-price-input"
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <div className="update-listing-regular-price-label">
              <p>Regular price</p>
              <span className="text-xs">($ / month)</span>
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="1000"
                required
                className="update-listing-discount-price-input"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="update-listing-discount-price-label">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          )}
        </div> */}



        

        <div className="update-listing-form-container">
      
          <div className="update-listing-form-section">
            <p className="update-listing-form-section-header">
              Images:
              <span className="update-listing-form-section-subheader">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="update-listing-form-flex-container">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="update-listing-form-file-input"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="update-listing-form-upload-button"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="update-listing-form-error-text">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div key={url} className="update-listing-form-image-container">
                  <img
                    src={url}
                    alt="listing image"
                    className="update-listing-form-image"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="update-listing-form-delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button
              disabled={loading || uploading}
              className="update-listing-form-submit-button"
            >
              {loading ? "Creating..." : "Update listing"}
            </button>
            {error && <p className="update-listing-form-error-text">{error}</p>}
          </div>
        </div>
      </form>
    </main>
  );

}
