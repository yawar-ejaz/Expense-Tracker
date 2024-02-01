import React from "react";

function Header({
    mainHeading = "Your Heading",
    sideHeading = "Subtitle or tagline goes here"
}) {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold">{mainHeading}</h1>
        <p className="mt-2 text-lg">{sideHeading}</p>
      </div>
    </header>
  );
}

export default Header;