import React from "react";

const Cancel = () => {
  return (
    <div
      style={{ minHeight: "calc(100vh - 85px)" }}
      className="w-full flex justify-center items-center p-2 flex-col"
    >
      <h1 className="text-4xl">Oops, something went wrong!</h1>

      <h2 className="text-2xl">
        Please try again with different payment method.
      </h2>
    </div>
  );
};

export default Cancel;
