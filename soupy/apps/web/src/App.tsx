import { useState } from "react";
import { ChatPage } from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";

export default function App() {
  const [started, setStarted] = useState(false);

  return started ? <ChatPage onHome={() => setStarted(false)} /> : <HomePage onStart={() => setStarted(true)} />;
}
