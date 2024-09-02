import { useEffect, useState, useRef } from "react";
import "./app.css";

const IMG_COUNT = 3;
const COL_COUNT = 5;
const DOG_URL = "https://dog.ceo/api/breeds/image/random";

const App = () => {
  const loadingRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isFetch, setIsFetch] = useState(true);

  const fetchImages = async () => {
    if (isFetch) {
      let imageList = [];
      for (let count = 0; count < IMG_COUNT; count++) {
        const res = await fetch(DOG_URL);
        const json = await res.json();
        imageList.push(json.message);
      }
      setImages((prevList) => [...prevList, ...imageList]);
      setIsFetch(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [isFetch]);

  useEffect(() => {
    let observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFetch(true);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadingRef.current);

    return () => {
      loadingRef.current && observer.unobserve(loadingRef.current);
    };
  }, [images]);

  return (
    <div className="outermost-container">
      <h1 className="heading"> Dog Gallery </h1>
      <div className="container">
        {[...Array(COL_COUNT)].map((_, colIdx) => (
          <div key={colIdx} className="column">
            {images.map(
              (image, imageIdx) =>
                imageIdx % COL_COUNT == colIdx && (
                  <img key={imageIdx} className="image" src={image} />
                )
            )}
          </div>
        ))}
      </div>
      <div ref={loadingRef}></div>
    </div>
  );
};

export default App;
