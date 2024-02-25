import { useEffect, useState } from "react";
import "./App.css";
const App = () => {
  const [planets, setPlanets] = useState([]);
  const [residents, setResidents] = useState([]);
  const [nextPage, setNextPage] = useState("");
  const [previousPage, setPreviousPage] = useState("");

  const fetchPlanets = async (url) => {
    try {
      const fetchUrl = url || "https://swapi.dev/api/planets/?format=json";
      const response = await fetch(fetchUrl);
      const data = await response.json();

      // Store the new planets
      setPlanets(data.results);

      // Fetch and store residents for each planet
      const residentsData = [];
      await Promise.all(
        data.results.map(async (planet) => {
          const residentsResponse = await Promise.all(
            planet.residents.map(async (residentURL) => {
              const residentResponse = await fetch(residentURL);
              const residentData = await residentResponse.json();
              residentsData.push({ ...residentData, homeworld: planet.url }); // Include homeworld information
            })
          );
        })
      );

      // Update the residents state with the new data
      setResidents(residentsData);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toPreviousPage = async (url) => {
    await fetchPlanets(url);
  };

  const toNextPage = async (url) => {
    await fetchPlanets(url);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  return (
    <div className="main-container">
      <div className="heading-container">
        <h1 className="heading">Explore Star Wars Planets!</h1>
      </div>
      <section id="card-section">
        {planets.map((planet) => (
          <>
            <div key={planet.url} className="planet-card">
              <div className="planet-heading">
                <h2 className="planet-name">{planet.name}</h2>
              </div>
              <div className="planet-details">
                <div className="p-detail">
                  <p>Climate: {planet.climate}</p>
                </div>
                <div className="p-detail">
                  <p>Population: {planet.population}</p>
                </div>
                <div className="p-detail">
                  <p>Terrain: {planet.terrain}</p>
                </div>
              </div>

              <div className="resident-container">
                {residents.filter(
                  (resident) => resident.homeworld === planet.url
                ).length > 0 && ( // Check if there are residents for the current planet
                  <div className="resident-heading-container">
                    <div className="resident-heading">
                      <h1 className="resident">Residents</h1>
                    </div>
                  </div>
                )}
                {residents
                  .filter((resident) => resident.homeworld === planet.url)
                  .map((resident) => (
                    <div key={resident.url} className="resident-card">
                      <div className="r-detail">
                        <div className="resident-details">
                          <h6>Name: {resident.name}</h6>
                        </div>
                        <div className="resident-details">
                          <h6>Height: {resident.height}</h6>
                        </div>
                        <div className="resident-details">
                          <h6>Mass: {resident.mass}</h6>
                        </div>
                        <div className="resident-details">
                          <h6>Gender: {resident.gender}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ))}
      </section>
      <section id="btn-section">
        <div className="btn-container">
          <button
            className="btn"
            onClick={() => {
              toPreviousPage(previousPage);
            }}
          >
            Previous
          </button>
          <button
            className="btn"
            onClick={() => {
              toNextPage(nextPage);
            }}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
