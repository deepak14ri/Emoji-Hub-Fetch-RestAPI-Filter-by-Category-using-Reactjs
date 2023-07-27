import React, { useState, useEffect } from "react";
import "./styles.css";
const EmojiHub = () => {
  const apiUrl = "https://emojihub.yurace.pro/api/all";
  const emojisPerPage = 10;

  const [emojis, setEmojis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAndExtractCategories();
  }, []);

  const fetchAndExtractCategories = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const categories = [...new Set(data.map((emoji) => emoji.category))];
      setCategories(categories);
      setEmojis(data);
    } catch (error) {
      console.error("Error fetching emojis:", error);
    }
  };

  const filterAndDisplayEmojis = () => {
    const filteredEmojis = selectedCategory
      ? emojis.filter((emoji) => emoji.category === selectedCategory)
      : emojis;
    return filteredEmojis;
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalEmojis = selectedCategory
      ? emojis.filter((emoji) => emoji.category === selectedCategory).length
      : emojis.length;
    const totalPages = Math.ceil(totalEmojis / emojisPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const emojisToDisplay = filterAndDisplayEmojis().slice(startIndex, endIndex);

  return (
    <div>
      <h1>
        <strong>Emoji Hub</strong>
      </h1>

      <div className="categoryFilter">
        <label htmlFor="category" style={{ marginBottom: "5px" }}>
          <strong>Filter by Category:</strong>
        </label>
        <select
          id="category"
          className="form-select"
          style={{ width: "20%", margin: "0 40% 0 40% !important" }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div id="emojiList">
        {emojisToDisplay.map((emoji) => (
          <div key={emoji.id} className="emojiCard">
            <p dangerouslySetInnerHTML={{ __html: emoji.htmlCode }} />
            <p>
              Name: {emoji.name}
              <br />
              Category: {emoji.category}
              <br />
              Group: {emoji.group}
            </p>
          </div>
        ))}
      </div>

      <div id="pagination">
        <div
          className="paginationButton"
          style={{ display: "inline-block" }}
          onClick={handlePreviousPage}
        >
          Previous
        </div>
        {currentPage > 5 && (
          <>
            <div className="paginationButton">...</div>
            <div
              className="paginationButton"
              style={{ display: "inline-block" }}
              onClick={() => setCurrentPage(1)}
            >
              1
            </div>
          </>
        )}
        {Array.from(
          { length: Math.min(10, Math.ceil(emojis.length / emojisPerPage)) },
          (_, index) => {
            const pageNumber = currentPage + index - 4;
            return pageNumber > 0 &&
              pageNumber <= Math.ceil(emojis.length / emojisPerPage) ? (
              <div
                key={pageNumber}
                className={`paginationButton ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                style={{ display: "inline-block" }}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </div>
            ) : null;
          }
        )}
        {currentPage < Math.ceil(emojis.length / emojisPerPage) - 4 && (
          <>
            <div className="paginationButton">...</div>
            <div
              className="paginationButton"
              style={{ display: "inline-block" }}
              onClick={() =>
                setCurrentPage(Math.ceil(emojis.length / emojisPerPage))
              }
            >
              {Math.ceil(emojis.length / emojisPerPage)}
            </div>
          </>
        )}
        <div
          className="paginationButton"
          style={{ display: "inline-block" }}
          onClick={handleNextPage}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default EmojiHub;
