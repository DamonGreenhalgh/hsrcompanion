import "./App.css";
import { useState, useEffect } from "react";

import hertaSpaceStationBg from "./assets/herta-space-station.png";
import belobogBg from "./assets/belobog.png";
import astralExpressBg from "./assets/astral-express.png";

import blackswanglass from "../public/blackswanglass.png";

import userDB from "./db/User.json";
import contactsDB from "./db/Contacts.json";
import messagesDB from "./db/Messages.json";

import { motion } from "motion/react";

function App() {
  const music = new Audio("../spacewalk.mp3");
  music.autoplay = true;
  music.muted = true;
  music.loop = true;
  const openDialog = new Audio("../stelle-open-dialog.ogg");

  const [user, setUser] = useState(userDB);

  const [contact, setContact] = useState(contactsDB[0]);
  const [event, setEvent] = useState(messagesDB[0]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(event.dialog[0]);
  const [options, setOptions] = useState([]);

  const addMessage = (profile, username, text, fromPlayer, removeLast) => {
    setMessages((prevMessages) => {
      const prev = removeLast ? prevMessages.slice(0, -1) : prevMessages;
      return [
        ...prev,
        <motion.div
          initial={{ y: "32px", opacity: "0" }}
          animate={{ y: "0", opacity: "1" }}
          transition={{ ease: "easeOut", duration: 0.4, type: "tween" }}
          className={`${fromPlayer ? "row-reverse" : "row"} gap`}
        >
          <div className="profile-container">
            <img src={profile} className="profile" />
          </div>

          <div className={`col gap-sm ${fromPlayer && "text-end"}`}>
            <h4>{username}</h4>
            <div
              className={`response-container ${
                fromPlayer && "response-container--player"
              }`}
            >
              <p className="response-text">{text}</p>
            </div>
          </div>
        </motion.div>,
      ];
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      addMessage(
        contactsDB[currentMessage.userId].icon,
        contactsDB[currentMessage.userId].name,
        currentMessage.text,
        false
      );
      // Continue NPC dialog if there is a next message
      if (currentMessage.hasOwnProperty("next")) {
        setCurrentMessage((prevMessage) => event.dialog[prevMessage.next]);
      }

      // Give user options to respond
      if (currentMessage.hasOwnProperty("options")) {
        setOptions(currentMessage.options);
      }
    }, currentMessage.text.length * contactsDB[currentMessage.userId].speed);

    return () => clearTimeout(timeout);
  }, [currentMessage]);

  return (
    <>
      <div
        className="col container"
        style={{ backgroundImage: `url(${hertaSpaceStationBg})` }}
      >
        <div className="col page gap">
          <img src={blackswanglass} className="blackswan-glass" />

          <div className="col">
            <h2>{event.title}</h2>
            <p>{event.flair}</p>
          </div>
          <div className="divider" />

          <div className="messages-container">{messages}</div>

          <div className={"col gap-sm"}>
            {options.map((option) => (
              <motion.button
                onClick={() => {
                  // Reset options
                  setOptions([]);
                  addMessage(user.icon, user.name, option.text, true);
                  setCurrentMessage(event.dialog[option.next]);
                }}
              >
                {option.text}
              </motion.button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            music.muted = false;
            openDialog.play();
          }}
        >
          Play Space Walk!
        </button>

        {/* <div className="col dots-container">
          {Array(10)
            .fill(0)
            .map((row, index) => (
              <div className="row">
                {Array(Math.ceil(window.innerWidth / 10))
                  .fill(0)
                  .map((col) => (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        margin: "10px",
                      }}
                      className="dot"
                    />
                  ))}
              </div>
            ))}
        </div> */}
      </div>
    </>
  );
}

export default App;
