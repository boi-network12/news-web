import React, { useContext, useState } from 'react'
import "./Home.css"
import { Header } from '../../components/Header/Header'
import SearchBar from '../../components/SearchBar/SearchBar'
import CategoryTabs from '../../components/CategoryTabs/CategoryTabs'
import { NotificationContext } from '../../context/NotificationContext'
import { PostContext } from '../../context/PostContext'
import NewsList from '../../components/NewsList/NewsList'
import NewsToday from '../../components/NewsToday/NewsToday'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [searchQuery, setSearchQuery] = useState("")
  const { notifications } = useContext(NotificationContext);
  const { posts, loading } = useContext(PostContext);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // function to filter posts by category
  const filterPostsCategory = (category) => {
    if (category === "All News") {
      return posts || [];
    } else if (category === "Trending") {
      return posts.slice().sort((a, b) => b.likeCount - a.likeCount) || [];
    } else {
      return posts.filter(post => post.category === category) || [];
    }
  };

  const searchPosts = () => {
    const query = searchQuery?.toString().toLowerCase() || "";
    return posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  };

  const filteredPosts = searchQuery ? searchPosts() : filterPostsCategory(selectedCategory)

  

  
  return (
    <div className="HomeWrapper">
        <Header unreadCount={unreadCount} />
        <div className="HomeContainer">

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <CategoryTabs onSelectCategory={setSelectedCategory}/>
          {!searchQuery && selectedCategory === "All News" && (
            <>
               <p className="sectionTitle" >Recent News</p>
               <NewsToday posts={posts} loading={loading} />
            </>
          )}
          
          <p className="sectionTitle" >{selectedCategory}</p>
            <NewsList
               posts={filteredPosts}
               loading={loading}
            />
        </div>
    </div>
  )
}

export default Home