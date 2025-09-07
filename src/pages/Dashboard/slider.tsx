import { useState, useEffect } from "react";

// ✅ Import your images
import img1 from "../../components/images/2.jpeg";
import img2 from "../../components/images/3.jpeg";

const AwarenessSlider = () => {
  const images = [img1, img2];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-lightblue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center">
      {/* Image */}
      <img
        src={images[currentIndex]}
        alt="Awareness"
        className="rounded-lg object-cover w-full h-48 transition-all duration-700"
      />

      {/* Navigation Dots */}
      <div className="flex mt-3 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-red-600 scale-125" : "bg-red-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AwarenessSlider;
