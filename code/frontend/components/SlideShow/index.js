import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slide1 from '../../assets/images/slide1.png';
import slide2 from '../../assets/images/slide2.png';
import './Slideshow.css';

const SlideShow = () => {
  var settings = {
    dots: false,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1000
  };

  return (
    <div className='slideArea'>
      <Slider {...settings}>
      <div className='slide'>
        <img src={slide1} alt="Slide 1" />
      </div>
      <div className='slide'>
        <img src={slide2} alt="Slide 2" />
      </div>
      </Slider>
    </div>
    
  );
};

export default SlideShow;
