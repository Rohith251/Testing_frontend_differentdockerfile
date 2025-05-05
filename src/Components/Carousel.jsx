import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: "https://www.unimoni.in/blog/wp-content/uploads/2023/06/free-forex-card-student-abroad.png",
      title: "Multi-Currency Forex Card",
      description: "One card, multiple currencies - travel the world with ease"
    },
    {
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80",
      title: "Global Acceptance",
      description: "Accepted at millions of locations worldwide"
    },
    {
      image: "https://www.bankofbaroda.in/-/media/project/bob/countrywebsites/india/blogs/investment/images/what-is-forex-card.jpg",
      title: "Secure Transactions",
      description: "Bank-grade security for your peace of mind"
    },
    {
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80",
      title: "Competitive Exchange Rates",
      description: "Get the best rates for your international transactions"
    },
    {
      image: "https://www.thomascook.in/blog/wp-content/uploads/2023/03/forex-cards-1-1.jpg",
      title: "24/7 Support",
      description: "Round-the-clock assistance for your forex needs"
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-control prev" onClick={prevSlide}>
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        <i className="bi bi-chevron-right"></i>
      </button>
      
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 