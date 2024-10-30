import { useState, useEffect } from 'react';

import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Input } from "@nextui-org/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Navbar = () => {
  const [environment, setEnvironment] = useState("Development");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [personId, setPersonId] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState('');

  useEffect(() => {

    setAuth(localStorage.getItem("auth"));

  });


  function switchEnvironment(env) {
    setEnvironment(env)
  };

  const handleSetPersonId = (e) => {
    setPersonId(e.target.value);
  };

  const handleSetPassword = (e) => {
    setPassword(e.target.value);
  };

  function login() {
    const credentials = `${personId}:${password}`;
    const encodedCredentials = btoa(credentials);

    localStorage.setItem("auth", encodedCredentials);
    setAuth(encodedCredentials)
  }


  return (
    <>
    <NextUINavbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Jevin FSM</p>
      </NavbarBrand>
      
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}
      
      <NavbarContent justify="end">

        <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  // endContent={icons.chevron}
                  radius="sm"
                  variant="light"
                >
                  <FontAwesomeIcon icon="fa-solid fa-globe" />
                  {environment}
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              // className="w-[34px]"
              // itemClasses={{
              //   base: "gap-4",
              // }}
            >
              <DropdownItem
                key="Development"
                // description="ACME scales apps to meet user demand, automagically, based on load."
                // startContent={icons.scale}
                onClick={() => switchEnvironment("Development")}
              >
                Development
              </DropdownItem>

              <DropdownItem
                key="Production"
                // description="ACME scales apps to meet user demand, automagically, based on load."
                // startContent={icons.scale}
                onClick={() => switchEnvironment("Production")}
              >
                Production
              </DropdownItem>
              
            </DropdownMenu>
        </Dropdown>

        <Button size="sm" onPress={onOpen} color="primary" variant='bordered'>{auth ? '~' : 'Login'}</Button>

      </NavbarContent>
    </NextUINavbar>

    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                // endContent={
                //   <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                // }
                label="Person Id"
                variant="bordered"
                value={personId}
                onChange={handleSetPersonId}
              />
              <Input
                // endContent={
                //   <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                // }
                label="Password"
                type="password"
                variant="bordered"
                value={password}
                onChange={handleSetPassword}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose} onClick={login}>
                Sign in
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    </>
  );
};

export default Navbar;
