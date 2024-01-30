import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

interface FormState {
  username: string;
  email: string;
  password: string;
  usernameError: { content: string; pointing: string } | null;
  emailError: { content: string; pointing: string } | null;
  passwordError: { content: string; pointing: string } | null;
  apiError: { content: string } | null;
}

export const Register: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    usernameError: null,
    emailError: null,
    passwordError: null,
    apiError: null,
  });

  const navigate = useNavigate();

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setFormState((oldState) => ({
        ...oldState,
        username: e.target.value,
        usernameError: { content: "Username is required", pointing: "above" },
      }));
    } else {
      setFormState((oldState) => ({
        ...oldState,
        username: e.target.value,
        usernameError: null,
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { username, email, password } = formState;
      const resp = await axios.post("/register", {
        username,
        email,
        password,
      });

      if (resp.status === 201) {
        navigate("/Login");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setFormState((oldState) => ({
          ...oldState,
          apiError: {
            content:
              "The UserName or Email or Password are Not Right. Please Register",
          },
        }));
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <label>Enter UserName</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formState.username}
            style={formState.usernameError ? { borderColor: "red" } : {}}
            onChange={handleUserNameChange}
          />
          {formState.usernameError && (
            <div style={{ color: "red" }}>
              {formState.usernameError.content}
            </div>
          )}

          <label>Enter Email</label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formState.email}
            style={formState.emailError ? { borderColor: "red" } : {}}
            onChange={handleEmailChange}
          />
          {formState.emailError && (
            <div style={{ color: "red" }}>{formState.emailError.content}</div>
          )}

          <label>Enter Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formState.password}
            style={formState.passwordError ? { borderColor: "red" } : {}}
            onChange={handlePasswordChange}
          />
          {formState.passwordError && (
            <div style={{ color: "red" }}>
              {formState.passwordError.content}
            </div>
          )}

          <Button primary type="submit">
            Register
          </Button>

          {formState.apiError && (
            <div style={{ color: "red" }}>{formState.apiError.content}</div>
          )}
        </form>
      </div>
      <div className="images-container">
        <img
          className="login-image"
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="dsds"
        />
      </div>
    </div>
  );
};
