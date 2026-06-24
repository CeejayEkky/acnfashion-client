import React from "react";
import { Link } from "react-router-dom";

const ProdGrids = ({ products, loading, error }) => {
  if(loading) {
    return <p>Loading ...</p>;
  }

  if(error) {
    return <p>Error Found!: {error}</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((prod, i) => (
        <Link key={i} to={`/product/${prod._id}`} className="block">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-full mb-4">
              <img
                src={prod.images[0].url}
                alt={prod.images[0].altText || prod.name}
                className="w-full h-80 border-2 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-sm mb-2">{prod.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">
                ₦{prod.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProdGrids;
