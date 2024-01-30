import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Form, Input, Button, SemanticICONS } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

interface FormState {
  email: string;
  password: string;
  emailError: { content: string; pointing: "above" } | null;
  passwordError: { content: string; pointing: "above" } | null;
  apiError: { content: string } | null;
}

export const Login: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    emailError: null,
    passwordError: null,
    apiError: null,
  });

  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setFormState((oldState) => ({
        ...oldState,
        email: e.target.value,
        emailError: { content: "Email is required", pointing: "above" },
      }));
    } else {
      setFormState((oldState) => ({
        ...oldState,
        email: e.target.value,
        emailError: null,
      }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setFormState((oldState) => ({
        ...oldState,
        password: e.target.value,
        passwordError: { content: "Password is required", pointing: "above" },
      }));
    } else {
      setFormState((oldState) => ({
        ...oldState,
        password: e.target.value,
        passwordError: null,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      const { email, password } = formState;
      const resp = await axios.post("/login", {
        email,
        password,
      });

      if (resp.status === 200) {
        navigate("/");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setFormState((oldState) => ({
          ...oldState,
          apiError: {
            content: "The Email and Password are Not Right. Please Register",
          },
        }));
      }
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ border: "4px solid skyblue", padding: "2em" }}
    >
      <Form.Input
        label="Email"
        type="email"
        value={formState.email}
        placeholder="Email"
        error={formState.emailError}
        onChange={handleEmailChange}
      />
      <Form.Input
        label="Password"
        type="password"
        value={formState.password}
        placeholder="Password"
        error={formState.passwordError}
        onChange={handlePasswordChange}
      />
      <Button type="submit">Login</Button>
      <p>
        Don't have an account?
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={handleRegisterClick}
        >
          Register
        </span>
      </p>
    </Form>
  );
};
