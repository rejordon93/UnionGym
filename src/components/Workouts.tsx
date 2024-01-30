import React, { useEffect, useState } from "react";
import { Button, Card, Image, Modal } from "semantic-ui-react";
import axios from "axios";

interface Workout {
  workout_id: number;
  workout_data: {
    gifUrl: string;
    target: string;
    name: string;
    instructions: string[];
  };
}

interface WorkoutsProps {}

export const Workouts: React.FC<WorkoutsProps> = () => {
  const [favorites, setFavorites] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("/favorites");
        console.log("Favorites Response:", response.data); // Log the response
        setFavorites(response.data.favorites || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleDelete = async (workout_id: number) => {
    try {
      console.log(workout_id);
      const response = await axios.delete(`/favorites/${String(workout_id)}`);

      if (response.status === 200) {
        const updatedFavorites = favorites.filter((favorite) => {
          return favorite.workout_id !== workout_id;
        });
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  const topRowFavorites = favorites.slice(0, 3);
  const bottomRowFavorites = favorites.slice(3, 6);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {topRowFavorites.map((favorite, index) => (
            <Card key={index} style={{ width: "400px", margin: "10px" }}>
              <Image src={favorite.workout_data?.gifUrl} wrapped ui={false} />
              <Card.Content>
                <Card.Header>Recipe Description</Card.Header>
                <Card.Description
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                >
                  {favorite.workout_data?.instructions.join("\n") ||
                    "No instructions available"}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button basic color="green">
                    More Info
                  </Button>
                  <Button
                    onClick={() => handleDelete(favorite.workout_id)}
                    basic
                    color="red"
                  >
                    Decline
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {bottomRowFavorites.map((favorite, index) => (
            <Card key={index + 3} style={{ width: "400px", margin: "10px" }}>
              <Image src={favorite.workout_data?.gifUrl} wrapped ui={false} />
              <Card.Content>
                <Card.Header>Recipe Description</Card.Header>
                <Card.Description
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                >
                  {favorite.workout_data?.instructions ||
                    "No description available"}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button basic color="green">
                    More Info
                  </Button>
                  <Button
                    onClick={() => handleDelete(favorite.workout_id)}
                    basic
                    color="red"
                  >
                    Decline
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
