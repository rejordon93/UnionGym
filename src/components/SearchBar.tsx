import React, { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { Card, Form, Input, Button, Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { Exercise, ButtonClickedState } from "../interfaces";
import "./SearchBar.css";

export const SearchBar: React.FC = () => {
  const [newWorkout, setNewWorkout] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [apiError, setApiError] = useState("");
  const [showError, setShowError] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<ButtonClickedState>({});

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/exercises?name=${encodeURIComponent(
          newWorkout
        )}`
      );

      const data = response.data;

      if (data.length === 0) {
        setApiError("No results found.");
        setExercises([]);
        setShowError(true);
      } else {
        setExercises(data);
        setApiError("");
        setShowError(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("An error occurred while fetching data.");
      setShowError(true);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newWorkout.trim() === "") {
      return;
    }
    fetchData();
    setNewWorkout("");
  };

  const handleWorkoutChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewWorkout(e.target.value);
  };

  const handleBtnClick = (exerciseId: number) => {
    setButtonClicked((prevClicked) => ({
      ...prevClicked,
      [exerciseId]: true,
    }));
  };

  return (
    <Grid textAlign="center" style={{ marginTop: "50px" }}>
      <h1>Workout Builder</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Search Workouts"
          value={newWorkout}
          onChange={handleWorkoutChange}
        />
        <Button type="submit" primary>
          Add Workout
        </Button>
      </Form>

      {showError && <div style={{ color: "red" }}>{apiError}</div>}

      <Card.Group
        itemsPerRow={3}
        className="AllCardsStyle"
        style={{ marginTop: "50px" }}
      >
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="ExerciseCard">
            <div className="ExerciseAll">
              <h2 className="ExerciseName">{exercise.name}</h2>
              <h3 className="ExerciseCategory">{exercise.category}</h3>
              <img src={exercise.gifUrl} alt="exercise" />
              <p className="ExerciseInstructions">
                Instructions: {exercise.instructions}
              </p>
            </div>

            <button
              onClick={() => handleBtnClick(exercise.id)}
              disabled={buttonClicked[exercise.id]}
              className="ui primary button Btn"
            >
              {buttonClicked[exercise.id] ? "Added to Favs" : "Add Workout"}
            </button>
          </Card>
        ))}
      </Card.Group>
    </Grid>
  );
};
