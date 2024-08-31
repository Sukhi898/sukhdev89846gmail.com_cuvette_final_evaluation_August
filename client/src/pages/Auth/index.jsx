import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Toaster } from "react-hot-toast";
import logo from "../../assets/QUIZZIE.png";
import { Button } from "../../components";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "./styles/index.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/authContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSignupSuccess = () => {
    setSelectedIndex(1);
  };

  return (
    <div className={styles.container}>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#fff",
            color: "black",
          },
        }}
      />
      <div className={styles.image}>
        <img src={logo} alt="logo" />
      </div>

      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabList className={styles.tabs}>
          <Tab as="div" className={styles.tab}>
            {({ selected }) => (
              <Button type="button" variant={selected ? "" : "ghost"}>
                Signup
              </Button>
            )}
          </Tab>
          <Tab as="div" className={styles.tab}>
            {({ selected }) => (
              <Button type="button" variant={selected ? "" : "ghost"}>
                Login
              </Button>
            )}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SignupForm onSuccess={handleSignupSuccess} />{" "}
          </TabPanel>
          <TabPanel>
            <LoginForm />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
