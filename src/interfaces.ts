export interface WorkoutInterface {
  id: number;
  workout: string;
}

export interface Exercise {
  id: number;
  name: string;
  category: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  instructions: string;
}
export interface ButtonClickedState {
  [key: string]: boolean;
}
