import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useVanContext } from "../../context/VanContext";
import "../../pages/Home.css";

const LandingPage = ({data}) => {
  const { setVanName } = useVanContext();
  return (
    <div className="home-container d-flex align-items-center justify-content-center min-vh-90">
        <div className="container px-4">
          <h1 className="text-center mt-4 p-5 mb-lg-5 display-5 fw-bold text-uppercase">
            Select Your Color
          </h1>
          <div className="row g-4 justify-content-center">

            {data?.cards?.map((card, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-4 col-xl-3 d-flex justify-content-center"
              >
                <Link to={card?.link} onClick={() => setVanName(card?.title)}
                  className="text-decoration-none w-100">
                  <Card
                    className={`h-100 border-2 border-transparent  $ {card.bgClass} transition-all`}
                  >
                    <div className="card-img-container p-3">
                      <Card.Img
                        variant="top"
                        src={card?.img}
                        className="card-img-custom"
                      />
                    </div>
                    <Card.Body className="d-flex flex-column pb-4">
                      <Card.Title className="text-center fs-5 fw-bold mb-3">
                        {card?.title}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            ))}


          </div>
        </div>
      </div>
  )
}

export default LandingPage