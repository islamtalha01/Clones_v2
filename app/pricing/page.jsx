"use client";

import { PRICING } from "../lib/constants";
import MySideBar from "../../components/MySideBar";
import PriceCard from "../../components/PriceCard";
import { useState, useEffect } from "react";
import { useRoom } from "../RoomContext";

const PricingPage = () => {
  const { activePlan } = useRoom();

  const [value, setValue] = useState(null);
  let userCreds;
  useEffect(() => {
    if (typeof window !== "undefined") {
      userCreds = localStorage.getItem("usercreds");
      setValue(userCreds);
    }
  }, []);

  return (
    <main className="relative flex flex-col ">
      <div className="flex flex-row ">
        <div className="flex  justify-center items-center  ">
          {/* <div className="container mx-auto mt-4">
            <h3 className="sm:text-xl uppercase font-semibold text-center mb-2 sm:mb-6 text-secondary">
              Pricing Plan
            </h3>
            <h2 className="text-[22px] sm:text-[32px] leading-[120%] md:text-[40px] max-w-[450px] mx-auto capitalize font-helveticaBold font-bold text-center  text-white mb-8">
              Pricing built for businesses of all sizes
            </h2>
            <p className="text-sm sm:text-base capitalize text-stonecairn max-w-[500px] text-center mx-auto mb-16">
              Provide flexibility and affordability while also offering features
              and services that can scale as a business grows
            </p>
            <div className="flex flex-row justify-center items-center  gap-6  ">
              {PRICING?.map((price) => (
                <PriceCard
                  price={price}
                  key={price.title}
                  userCred={value}
                  isActivePlan={price.title === activePlan}
                />
              ))}
            </div>
          </div> */}

<div className="container mx-auto mt-4">
  <h3 className="sm:text-xl uppercase font-semibold text-center mb-2 sm:mb-6 text-secondary">
    Pricing Plan
  </h3>
  <h2 className="text-[22px] sm:text-[32px] leading-[120%] md:text-[40px] max-w-[450px] mx-auto capitalize font-helveticaBold font-bold text-center text-white mb-8">
    Pricing built for businesses of all sizes
  </h2>
  <p className="text-sm sm:text-base capitalize text-stonecairn max-w-[500px] text-center mx-auto mb-16">
    Provide flexibility and affordability while also offering features
    and services that can scale as a business grows
  </p>
  <div className="flex flex-wrap justify-center items-center gap-6">
    {PRICING?.map((price,index) => (
      <div key={index} className="flex-1 min-w-[250px] max-w-[300px]">
        <PriceCard
          price={price}
          key={price.title}
          userCred={value}
          isActivePlan={price.title === activePlan}
        />
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </main>
  );
};

export default PricingPage;
