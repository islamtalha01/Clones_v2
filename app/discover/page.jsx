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
import MySideBar from "../../components/MySideBar";
import { useRoom } from "../RoomContext";
const cardsData = [
  {
    name: "Zoey Lang",
    username: "@zoeylang",
    avatar: "https://nextui.org/avatars/avatar-1.png",
    description:
      "Jamie Gold is an empathetic AI therapist dedicated to helping people navigate their mental health challenges with personalized support and insightful guidance. Through compassionate listening and tailored strategies, Jamie empowers individuals to achieve emotional well-being and resilience. He focuses on Trauma and Family conflict.",
    link: "https://github.com/nextui-org/nextui",
    heading: "Therapist AI",
  },
  {
    name: "Alex Doe",
    username: "@alexdoe",
    avatar: "https://nextui.org/avatars/avatar-2.png",
    description:
      "Jamie Gold is an empathetic AI therapist dedicated to helping people navigate their mental health challenges with personalized support and insightful guidance. Through compassionate listening and tailored strategies, Jamie empowers individuals to achieve emotional well-being and resilience. He focuses on Trauma and Family conflict.",
    link: "https://github.com/nextui-org/nextui",
    heading: "Mentor AI",
  },
  {
    name: "Jane Smith",
    username: "@janesmith",
    avatar: "https://nextui.org/avatars/avatar-3.png",
    description:
      "Jamie Gold is an empathetic AI therapist dedicated to helping people navigate their mental health challenges with personalized support and insightful guidance. Through compassionate listening and tailored strategies, Jamie empowers individuals to achieve emotional well-being and resilience. He focuses on Trauma and Family conflict.",
    link: "https://github.com/nextui-org/nextui",
    heading: "Friend AI",
  },
];

const CardComponent = ({ card }) => {
  // const [isRoomFull, setIsRoomFull] = useState(false);

  const { isRoomFull } = useRoom();

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key":
          "NWRjOTRjOTZjYTExNDk5MWIzNzllM2IxMzJjNjg1NTEtMTcyMTc5NjA0OA==",
      },
    };

    fetch("https://api.heygen.com/v1/streaming.list", options)
      .then((response) => response.json())
      .then((response) => {
        setIsRoomFull(response.data.sessions.length > 3);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    // <Link href="/agent">
    //   <Card className="max-w-[400px] max-sm:w-full  max-sm:h-[500px] h-[360px]">
    //     <CardHeader className="justify-between">
    //       <div className="flex gap-5">
    //         <Avatar isBordered radius="full" size="md" src={card.avatar} />
    //         <div className="flex flex-col gap-1 items-start justify-center">
    //           <h4 className="text-small font-semibold leading-none text-default-600">
    //             {card.name}
    //           </h4>
    //           <h5 className="text-small tracking-tight text-default-400">
    //             {card.username}
    //           </h5>
    //         </div>
    //       </div>
    //     </CardHeader>

    //     <CardBody>
    //       <div className="pt-1 pb-2">
    //         <Chip radius="md">Therapist</Chip>
    //       </div>
    //       <h1 className="text-lg font-bold">{card.heading}</h1>
    //       <p className="p-2 text-small">{card.description}</p>
    //     </CardBody>
    //     <CardFooter className="p-0">
    //       {isRoomFull ? (
    //         <div className="w-full  text-center bg-red-500 py-3">Room Full</div>
    //       ) : (
    //         <></>
    //       )}
    //     </CardFooter>
    //     <Divider />
    //   </Card>
    // </Link>

    <>
      {isRoomFull ? (
        <div className="max-w-[400px] max-sm:w-full max-sm:h-[500px] h-[360px]">
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
                <Chip radius="md">Therapist</Chip>
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
        <Link href="/agent">
          <Card className="max-w-[400px] max-sm:w-full max-sm:h-[500px] h-[360px]">
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
                <Chip radius="md">Therapist</Chip>
              </div>
              <h1 className="text-lg font-bold">{card.heading}</h1>
              <p className="p-2 text-small">{card.description}</p>
            </CardBody>
            <CardFooter className="p-0"></CardFooter>
            <Divider />
          </Card>
        </Link>
      )}
    </>
  );
};

const Discover = () => {
  return (
    <main className="relative flex flex-col  items-center justify-center ">
      <div className="flex flex-row ">
        {/* <div className="w-[250px]  flex flex-col">
          <MySideBar />
        </div> */}
        <div className="flex  justify-center items-center  max-sm:w-screen">
          <div>
            <div className=" m-4  text-3xl font-extrabold">
              AI Clones
              <div className="flex max-lg:flex-col gap-12 m-12">
                {cardsData.map((card, index) => (
                  <CardComponent key={index} card={card} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Discover;
