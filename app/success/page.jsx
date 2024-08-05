import React from "react";
import MySideBar from "../../components/MySideBar";
const Success = () => {
  return (
    <main className="relative flex flex-col  w-screen">
      <div className="flex flex-row ">
        <div className="w-[250px]  flex flex-col">
          <MySideBar />
        </div>
        <div className="flex  justify-center items-center w-screen ">
          <div
            style={{ minHeight: "calc(100vh - 85px)" }}
            className="w-full flex justify-center items-center p-2 flex-col"
          >
            <h1 className="text-4xl">Thanks for choosing Us!</h1>

            <h2 className="text-2xl">Your order is confirmed.</h2>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Success;
