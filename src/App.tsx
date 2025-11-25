import "./utility.css";
import "./App.css";
import { useState, useEffect, type JSX } from "react";
import { motion } from "motion/react";
import hertaSpaceStationBg from "./assets/herta-space-station.png";
import belobogBg from "./assets/belobog.png";
import astralExpressBg from "./assets/astral-express.png";
import blackswanglass from "./assets/blackswanglass.png";

import {
  type Contact,
  defaultContact,
  type ContactCollection,
  type Event,
  defaultEvent,
  type EventCollection,
  type Message,
  defaultMessage,
  type MessageCollection,
} from "./types/index.js";

// DB static content - switch to postgreSQL DB later
import ContactsJSON from "./db/Contacts.json" with { type: "json" };
import EventsJSON from "./db/Events.json" with { type: "json" };
import MessagesJSON from "./db/Messages.json" with { type: "json" };

const contacts: ContactCollection = ContactsJSON;
const events: EventCollection = EventsJSON;
const messages: MessageCollection = MessagesJSON;

const music = new Audio("../spacewalk.mp3");
music.loop = true;
const openDialog = new Audio("../stelle-open-dialog.ogg");

const handleAppStart = () => {
  music.play();
  setTimeout(() => {
    openDialog.play();
  }, 3000);
};

const handleMute = () => {
  music.muted = !music.muted;
  openDialog.muted = !openDialog.muted;
};

function App() {

  const [currentEvent, setCurrentEvent] = useState<Event>(events[0] ?? defaultEvent);
  const [history, setHistory] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState<boolean>(false);
  const [currentContact, setCurrentContact] = useState<Contact>(defaultContact);
  const [currentMessage, setCurrentMessage] = useState<Message>(defaultMessage);
  const [options, setOptions] = useState<Message[]>([])

  const handleUserResponse = (msg: Message) => {
    setCurrentMessage(messages[msg.next] ?? defaultMessage);
    history.push(msg);
    setOptions([]);
  }

  useEffect(() => {
    setCurrentMessage(messages[currentEvent.startMessageId] ?? defaultMessage);
  }, [])

  useEffect(() => {
    setCurrentContact(contacts[currentMessage.contactId] ?? currentContact);
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      // Add previous message to history
      history.push(currentMessage)

      // Expects user to respond
      if (currentMessage.promptPlayer) {
        setOptions(currentMessage.options
          .map((optionId) => messages[optionId])
          .filter((msg) => msg !== undefined)
        );
        // NPC responds
      } else if (currentMessage.next && currentMessage.next > 0) {
        setCurrentMessage(messages[currentMessage.next] ?? currentMessage);
      }
    }, currentMessage.content.length * 75);
  }, [currentMessage])

  return (
    <>
      <div
        className="col container"
        style={{ backgroundImage: `url(${hertaSpaceStationBg})` }}
      >
        <button
          onClick={handleAppStart}
        >
          Click to view!
        </button>
        <button onClick={handleMute}>Mute/Unmute</button>
        <div className="col page gap-16">

          <img src={blackswanglass} className="blackswan-glass" />

          <div className="col">
            <h2>{currentEvent.title}</h2>
            <p>{currentEvent.flair}</p>
          </div>

          <div className="divider" />

          <div className="dialog-container">

            {/* Chat history */}
            {history.map((msg) =>
              <div
                className="row gap-16"
                style={{ flexDirection: msg.contactId === 0 ? 'row-reverse' : 'row' }}
              >
                <div className="profile-container">
                  <img className="profile" src={contacts[msg.contactId]?.icon} />
                </div>
                <div className="col">
                  <p>{contacts[msg.contactId]?.name}</p>
                  <div className={`message-container ${msg.contactId === 0 ? 'message-container--player' : ''}`}>
                    <p className="message-text">{msg.content}</p>
                  </div>
                </div>
              </div>
            )}

            {/* NPC is typing*/}
            {showTyping &&
              <div className="row gap-16">
                <div className="profile-container">
                  <img className="profile" src={currentContact.icon} />
                </div>
                <div className="col">
                  <p>{currentContact.name}</p>
                  <div className="row gap-4 message-container">
                    <div className="pending-message-dot" style={{ animationDelay: "0s" }} />
                    <div className="pending-message-dot" style={{ animationDelay: ".5s" }} />
                    <div className="pending-message-dot" style={{ animationDelay: "1s" }} />
                  </div>
                </div>
              </div>
            }

            {/* User response */}
            {options && options.map((msg) =>
              <button onClick={() => handleUserResponse(msg)}>
                {msg.content}
              </button>
            )}

          </div>

          <div className={"col gap-sm"}></div>
        </div>
      </div>
    </>
  );
}

export default App;
