import {useState, useEffect, useCallback, useRef} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, updateQuery] = useState('');
  const [books, updateBooks] = useState([]);
  const [debounceTimeout, updateDebounceTimeout] = useState();
  const [isLoading, updateIsLoading] = useState(false);
  const [pageNumber, updatePageNumber] = useState(1);
  const [stopFetching, updateStopFetching] = useState(false);

  const observer = useRef(null);
  
  const lastTitleRef = useCallback((lastBookElement) => {
    if (!isLoading) {
      if (observer.current) {
        observer.current.disconnect();
      }
  
      const intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !stopFetching) {
          updatePageNumber(prevPageNumber => prevPageNumber + 1);
        }
      }, {rootMargin: '10px', thershold: 1});
  
      if (lastBookElement) {
        intersectionObserver.observe(lastBookElement);
      }
  
      observer.current = intersectionObserver;
    }
  }, [isLoading]);

  const fetchBooksData = () => {
    return axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: {
        q: query,
        page: pageNumber
      }
    }); 
  };

  const transformBooksData = (data) => {
    return data.docs.map((book) => {return {title: book.title, key: book.jey}});
  };

  const loadBooks = () => {
    updateIsLoading(true);
    fetchBooksData().then((res) => {
      if (!res.data.docs.length) {
        updateStopFetching(true);
      }
      const transformedBooksData = transformBooksData(res.data) || [];
      updateBooks([...books, ...transformedBooksData]);
    }).finally(() => updateIsLoading(false));
  }

  useEffect(() => {
    if (pageNumber > 1) {
      loadBooks();
    }
  }, [pageNumber]);

  useEffect(() => {
    if (query.length > 3) {
      loadBooks();
    }
  }, [query]);

  const handleInputChange = (value) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeoutId = setTimeout(() => {
      updateBooks([]);
      updateStopFetching(false);
      updatePageNumber(1);
      updateQuery(value);
    }, 650);
    updateDebounceTimeout(timeoutId);
  };

  const renderBookTitles = () => {
    return books.map((book, index) => {
      if (index === books.length - 1) {
        return <div ref={lastTitleRef} key={book.key}>{book.title}</div>
      }
      return <div key={book.key}>{book.title}</div>;
    });
  };

  return (
    <>
      <input type="text" onChange={(e) => handleInputChange(e.target.value)}/>
      {renderBookTitles()}
      {isLoading && <p><strong>...Loading more books</strong></p>}
    </>
  );
}

export default App;
