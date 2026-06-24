import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
const [isDragging, setIsDragging] = useState(false)
const [startX, setStartX] = useState(0)
const [scrollLeft, setScrollLeft] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data)
      } catch (error) {
        console.error(error);
        
      }
    }
    fetchNewArrivals()
  }, [])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if(!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  const scroll = (dir) => {
    const container = scrollRef.current;

    if (!container) return;

    const scrollAmount = dir === "left" ? -350 : 350;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const updateScrollBtns = () => {
    const container = scrollRef.current;

    if (!container) return;

    const leftScroll = container.scrollLeft;

    const rightScrollable =
      container.scrollWidth >
      leftScroll + container.clientWidth + 5;

    setCanScrollLeft(leftScroll > 0);
    setCanScrollRight(rightScrollable);
  };

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    container.addEventListener("scroll", updateScrollBtns);

    updateScrollBtns();

    return () => {
      container.removeEventListener("scroll", updateScrollBtns);
    };
  }, [newArrivals]);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto px-4 relative">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore New Arrivals
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            From trendy streetwear to timeless essentials, discover our newest
            collection crafted to elevate your everyday style with confidence,
            elegance, comfort, and premium fashion energy.
          </p>
        </div>

        {/* PRODUCTS */}
        <div
          ref={scrollRef}
          className={`flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"} `}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          
          {newArrivals.map((prod) => (
            <div
              key={prod._id}
              className="min-w-[85%] sm:min-w-[48%] lg:min-w-[30%] group relative"
            >
              <div className="overflow-hidden rounded-2xl shadow-lg relative">
                <img
                  src={prod.images[0]?.url}
                  alt={prod.images[0]?.altText || prod.name}
                  draggable="false"
                  className="w-full h-105 object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500"></div>

                {/* PRODUCT INFO */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md text-white p-5">
                  <Link to={`/product/${prod._id}`}>
                    <h4 className="text-lg font-semibold tracking-wide">
                      {prod.name}
                    </h4>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-blue-300 font-bold text-lg">
                        ₦{prod.price.toLocaleString()}
                      </p>

                      <button className="px-4 py-2 text-sm rounded-full bg-white text-black hover:bg-blue-500 hover:text-white transition-all duration-300">
                        View
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;