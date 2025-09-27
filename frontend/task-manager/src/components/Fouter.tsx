import React from "react";

const Fouter = () => {
  return (
    <footer className="w-full bg-gray-100 py-4 mt-8 shadow-inner">
      <div className="text-center text-gray-600 text-sm">
        Task Manager © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
};

export default Fouter;
