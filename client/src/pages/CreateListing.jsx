import React from "react";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./CreateListing.css";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);

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
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
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
      const res = await fetch("/api/listing/create", {
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
    <main className="create-listing-container">
      <h1 className="create-listing-title">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="create-listing-form">
        <div className="form-section">
          <input
            type="text"
            placeholder="Name"
            className="form-input"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="form-input"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="form-input"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="checkbox-group">
            {["sale", "rent", "parking", "furnished", "offer"].map((id) => (
              <div key={id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={id}
                  className="checkbox-input"
                  onChange={handleChange}
                  checked={formData[id]}
                />
                <label htmlFor={id}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div className="input-group">
            {["bedrooms", "bathrooms", "regularPrice"].map((id) => (
              <div key={id} className="input-item">
                <label htmlFor={id}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </label>
                <input
                  type="number"
                  id={id}
                  min={id === "regularPrice" ? "800" : "1"}
                  max={id === "regularPrice" ? "10000" : "10"}
                  required
                  className="form-input"
                  onChange={handleChange}
                  value={formData[id]}
                />
                {id === "regularPrice" && (
                  <span className="input-label">($ / month)</span>
                )}
              </div>
            ))}
            {formData.offer && (
              <div className="input-item">
                <label htmlFor="discountPrice">Discounted price</label>
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000"
                  required
                  className="form-input"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <span className="input-label">($ / month)</span>
              </div>
            )}
          </div>
        </div>
        <div className="image-section">
          <p className="image-label">
            Images:
            <span className="image-description">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="image-upload">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="file-input"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="upload-button"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="error-message">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="image-item">
                <img src={url} alt="listing image" className="image-preview" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading || uploading} className="create-button">
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="error-message-small">{error}</p>}
        </div>
      </form>
    </main>
  );
}

// CreateListing.css
