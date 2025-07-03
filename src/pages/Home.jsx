
import Navbar from "../components/navbar/Navbar"
import { useAuth } from "../context/AuthContext";
import LandingPage from "../components/landing-page/LandingPage";
import cards from "../json data/cards.json";
import "./Home.css";
const Home = () => {
  const { user } = useAuth();


  return (
    <>

      <Navbar user={user} />
      <LandingPage data={cards} />

    </>
  );
};

export default Home;
