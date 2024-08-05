import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
const LoginModel = ({ onOpen, isOpen, onOpenChange, supabase }) => {
  ThemeSupa.default.colors.brand = "#1E75FF";
  ThemeSupa.default.colors.brandAccent = "#1461db";

  const authProps = {
    supabaseClient: supabase,
    appearance: { theme: ThemeSupa },
    providers: ["google"],
    redirectTo: process.env.NEXT_PUBLIC_URL,
  };
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error signing out:", error.message);
  };

  return (
    <>
      {/* <div className='flex justify-center items-center h-screen'>
        <Button onPress={onOpen}>Login</Button>
      </div> */}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sign up or Log in To your Account
              </ModalHeader>
              <ModalBody>
                <Auth {...authProps} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModel;
