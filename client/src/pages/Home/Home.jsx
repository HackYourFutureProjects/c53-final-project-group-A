import TEST_ID from "./Home.testid";
import hyfLogo from "../../assets/hyf-logo.png";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <h1>This is the homepage</h1>
      <p>Good luck with the project!</p>
      <img src={hyfLogo} alt="HackYourFuture Logo" style={{ width: "200px" }} />
    </div>
  );
};

export default Home;
