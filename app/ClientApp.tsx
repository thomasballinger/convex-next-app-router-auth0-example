"use client";

import { api } from "../convex/_generated/api";
import { AuthLoading, Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { FormEvent, useState } from "react";
import Badge from "./Badge";
import LogoutButton from "./LogoutButton";
import useStoreUserEffect from "./useStoreUserEffect";
import LoginPage from "./LoginPage";

export default function ClientApp() {
  return (
    <>
    <Authenticated>
      <App />
    </Authenticated>
    <Unauthenticated>
      <LoginPage />
    </Unauthenticated>
    <AuthLoading>
      <main>Loading...</main>
    </AuthLoading>
    </>
  );
}

function App() {
  const userId = useStoreUserEffect();

  const messages = useQuery(api.messages.list) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.messages.send);

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    await sendMessage({ body: newMessageText });
    setNewMessageText("");
  }
  return (
    <main>
      <h1>Convex Chat</h1>
      {Badge()}
      <h2>
        <LogoutButton />
      </h2>
      <ul>
        {messages.map((message: any) => (
          <li key={message._id.toString()}>
            <span>{message.author}:</span>
            <span>{message.body}</span>
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
          placeholder="Write a message…"
        />
        <input
          type="submit"
          value="Send"
          disabled={newMessageText === "" || userId === null}
        />
      </form>
    </main>
  );
}
