import React, { useState, useEffect, useContext } from 'react';
import { PostContext } from '../../context/PostContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constant/categories';
import { ClipLoader } from 'react-spinners';



export default function Post() {
  const router = useNavigate();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const { createPost } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  const [category, setCategory] = useState(null);
  const [important, setImportant] = useState(null);

  const [countryList, setCountryList] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const formattedCountries = data.map((c) => c.name.common);
        setCountryList(formattedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const pickImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Cloudinary preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dypgxulgp/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleCountryChange = (text) => {
    setCountry(text);
    if (text.length > 0) {
      const filtered = countryList.filter((c) =>
        c.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleCategoryChange = (text) => {
    setCategory(text);
    if (text.length > 0) {
      const filtered = CATEGORIES.filter((cat) =>
        cat.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowCategoryDropdown(true);
    } else {
      setFilteredCategories([]);
      setShowCategoryDropdown(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !article || !category) {
      alert('Please fill all required fields: Title, Content, Category');
      return;
    }

    setLoading(true);
    let imageUrl = null;

    if (image) {
      const file = await fetch(image).then((res) => res.blob());
      imageUrl = await uploadImage(file);
    }

    const postData = {
      title,
      content: article,
      image: imageUrl,
      category,
      country,
      important: important === true,
    };

    try {
      await createPost(postData);
      router("/");
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-container">
      <div className="header">
        <button onClick={() => router.back()} className="back-button-auth">
          ←
        </button>
        <button onClick={handleSubmit} className="post-button-auth">
          Post
        </button>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Category"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="input-field"
        />
        {showCategoryDropdown && (
          <ul className="dropdown-list">
            {filteredCategories.length > 0
              ? filteredCategories.map((item, index) => (
                  <li
                    key={`${item.label}-${index}`}
                    onClick={() => {
                      setCategory(item.label);
                      setShowCategoryDropdown(false);
                    }}
                    className="dropdown-item"
                  >
                    {item.label}
                  </li>
                ))
              : CATEGORIES.map((item, index) => (
                  <li
                    key={`${item.label}-${index}`}
                    onClick={() => {
                      setCategory(item.label);
                      setShowCategoryDropdown(false);
                    }}
                    className="dropdown-item"
                  >
                    {item.label}
                  </li>
                ))}
          </ul>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Country"
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="input-field"
        />
        {showDropdown && (
          <ul className="dropdown-list">
            {filteredCountries.map((item, index) => (
              <li
                key={`${item}-${index}`}
                onClick={() => {
                  setCountry(item);
                  setShowDropdown(false);
                }}
                className="dropdown-item"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dropdown-wrapper">
        <select
          value={important}
          onChange={(e) => setImportant(e.target.value === 'true')}
          className="dropdown"
        >
          <option value={null}>Is it Important?</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>

      <div className="scroll-container">
        <div className="image-picker" onClick={pickImage}>
          {image ? (
            <img src={image} alt="Selected" className="image" />
          ) : (
            <span>Pick an Image</span>
          )}
        </div>

        <input
          type="text"
          placeholder="Enter article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />

        <textarea
          placeholder={`${user.name}, Write your article here...`}
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          className="text-area"
        />

        <button onClick={handleSubmit} disabled={loading} className="submit-button">
          {loading ? (
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10
              }}>
               <ClipLoader size={20} color="#fff" />
               <p>submitting...</p>
            </div>
          ) : 'Submit'}
        </button>
      </div>
    </div>
  );
}

// CSS Styles
const styles = `
  .post-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    background-color: #f9f9f9;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    background-color: white;
  }

  .back-button-auth, .post-button-auth {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: "#333";
  }

  .input-container {
    position: relative;
    margin-bottom: 10px;
  }

  .input-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 1000;
  }

  .dropdown-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }

  .dropdown-item:hover {
    background-color: #f1f1f1;
  }

  .dropdown-wrapper {
    margin-bottom: 10px;
  }

  .dropdown {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .image-picker {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #ddd;
    border-radius: 10px;
    margin-bottom: 20px;
    background-color: #f1f1f1;
    cursor: pointer;
  }

  .image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }

  .text-area {
    width: 100%;
    height: 150px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 20px;
    resize: vertical;
  }

  .submit-button {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }

  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);