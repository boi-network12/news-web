import React, { useState } from 'react'
import "./CategoryTabs.css"
import { CATEGORIES } from '../../constant/categories';
import { Link } from 'react-router-dom';

const categories = ["All News", "Trending", ...CATEGORIES.map(category => category.label)];

const CategoryTabs = ({ onSelectCategory }) => {
    const [activeCategory, setActiveCategory] = useState("All News");

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
        onSelectCategory(category)
    }

    return (
        <div className="categoryContainer">
            {categories.map((category, index) => (
                <Link
                   key={index}
                   className={`categoryItem ${activeCategory === category ? 'activeCategory' : ''}`}
                   onClick={() => handleCategoryPress(category)}
                >
                    <p className={`categoryText ${activeCategory === category ? 'activeCategoryText' : ''}`}>
                        {category}
                    </p>
                </Link>
            ))}
        </div>
    );
    
}

export default CategoryTabs