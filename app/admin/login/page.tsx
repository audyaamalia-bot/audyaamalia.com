"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, null as null | { error: string });
  return (
    <main className="adm-main" style={{ maxWidth: 360, paddingTop: 120 }}>
      <form action={action} className="card">
        <h1>Admin login</h1>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" name="password" autoFocus required />
        </div>
        {state?.error ? <p className="err">{state.error}</p> : null}
        <button className="btn" disabled={pending}>{pending ? "…" : "Masuk"}</button>
      </form>
    </main>
  );
}
