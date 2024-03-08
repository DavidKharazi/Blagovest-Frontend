import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';

export default function MediaCard() {
  const [articles, setArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState(4);
  const articlesPerPage = 4;

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/api/articles/';

    axios.get(apiUrl)
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении статей:', error);
      });
  }, []);

  const loadMoreArticles = () => {
    setVisibleArticles(prev => prev + articlesPerPage);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '80vh', overflowY: 'auto' }}>
      {articles.slice(0, visibleArticles).map(article => (
        <div key={article[0]} style={{ width: '80%', boxShadow: '9px 9px 30px rgba(0, 0, 0, 0.9)', margin: '10px' }}>
          {/* Article Title */}
          <Typography variant="body2" color="brown" style={{ fontSize: '2.5rem', fontFamily: 'Georgia', textTransform: 'uppercase', padding: '16px', textAlign: 'center' }}>
            {article[1]}
          </Typography>

          {/* Article Image */}
          <img src={article[3]} alt={article[1]} style={{ width: '100%', objectFit: 'cover' }} />

          {/* Article Content */}
          <div style={{ padding: '56px' }}>
            {/* Splitting the article content into paragraphs */}
            {article[2].split('\n').map((paragraph, index) => (
              <Typography key={index} variant="body2" color="brown" style={{ fontSize: '1.2rem', fontFamily: 'Arial', wordWrap: 'break-word', marginBottom: '8px' }}>
                {paragraph}
              </Typography>
            ))}
          </div>
        </div>
      ))}

      {visibleArticles < articles.length && (
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#4CAF50', // Green color
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={loadMoreArticles}
        >
          Еще
        </button>
      )}
    </div>
  );
}
