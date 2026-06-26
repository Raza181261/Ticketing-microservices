import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className="fifa-auth-page fifa-page">
    <form onSubmit={onSubmit} className="fifa-auth-card">
      <div className="text-center mb-4">
        <div className="fifa-auth-icon">🏆</div>
        <h1 className="fifa-auth-title fifa-gradient-text display-4 mb-0">Sign Up</h1>
        <p className="fifa-auth-note mb-0">Join the tournament and publish your tickets.</p>
      </div>
      <div className="fifa-form-group">
        <label className="fifa-label">Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control fifa-input"
          placeholder="you@example.com"
        />
      </div>
      <div className="fifa-form-group">
        <label className="fifa-label">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control fifa-input"
          type="password"
          placeholder="Create a secure password"
        />
      </div>
      {errors}
      <button className="btn btn-primary fifa-submit w-100 mt-4">Sign Up</button>
    </form>
    </div>
  );
};
