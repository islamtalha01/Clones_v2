"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Divider,
  Chip,
  CardFooter,
  Link,
} from "@nextui-org/react";
import { createClient } from "../../utils/supabase/client";
import LoginModal from "../../components/LoginModal";
import { useRoom } from "../RoomContext";
import { cardsData } from "../lib/constants";
import "./page.css";

const CardComponent = ({ card }) => {
  const { isRoomFull, setIsRoomFull } = useRoom();

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
      },
    };

    fetch("https://api.heygen.com/v1/streaming.list", options)
      .then((response) => response.json())
      .then((response) => {
        setIsRoomFull(response.data.sessions.length >= 3);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {isRoomFull ? (
        <div className="max-w-[336px] max-sm:w-full max-sm:h-[500px] h-[392px] bg-[#1C1C24] border-[0.5px] border-gray-300 rounded-md p-4">
          <Card>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar isBordered radius="full" size="md" src={card.avatar} />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {card.name}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    {card.username}
                  </h5>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="pt-1 pb-2">
                <Chip radius="md font-bold ">Therapist</Chip>
              </div>
              <h1 className="text-lg font-bold">{card.heading}</h1>
              <p className="p-2 text-small">{card.description}</p>
            </CardBody>
            <CardFooter className="p-0">
              <div className="w-full text-center bg-red-500 py-3">
                Room Full
              </div>
            </CardFooter>
            <Divider />
          </Card>
        </div>
      ) : (
        <Card className="max-w-[336px] max-sm:w-full max-sm:h-[500px] h-[392px] bg-[#1C1C24] border-[0.5px] border-gray-300 rounded-md p-4 hover:bg-white hover:text-black transition duration-300">
          <Link href="/agent">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar isBordered radius="full" size="md" src={card.avatar} />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600 group-hover:text-black">
                    {card.name}
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400 group-hover:text-black">
                    {card.username}
                  </h5>
                </div>
              </div>
            </CardHeader>
          </Link>
          <CardBody>
            <div className="pt-1 pb-2">
              <Chip radius="md">Therapist</Chip>
            </div>
            <h1 className="text-lg  group-hover:text-black">{card.heading}</h1>
            <p className="p-2 text-small group-hover:text-black">
              {card.description}
            </p>
          </CardBody>
          <CardFooter className="p-0"></CardFooter>
          <Divider />
        </Card>
      )}
    </>
  );
};

const Discover = () => {
  const [user, setUser] = useState(false);
  const supabase = createClient();
  const [loader, setLoader] = useState(false);
  const fetchUser = async () => {
    setLoader(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // console.log("user data", user);

    if (user) {
      console.log("user data present", user);

      setUser(true);
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {loader ? (
        // <BlackOverlay isLoading={true} />
        <main className="relative flex flex-col   "></main>
      ) : (
        <>
          {!user && <LoginModal />}

          <main className="relative flex flex-col   ">
            <div className="flex flex-row ">
              <div className="flex  justify-center items-center  max-sm:w-screen">
                <div>
                  <div className=" m-4  text-3xl font-extrabold">
                    AI Clones
                    <div className="flex max-lg:flex-col gap-12 m-12">
                      {cardsData?.map((card, index) => (
                        <CardComponent key={index} card={card} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Discover;
