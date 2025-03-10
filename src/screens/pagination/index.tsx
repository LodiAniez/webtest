import Colors from "@/common/colors";
import Images from "@/common/images";
import Modal from "@/components/Modal";
import TextInput from "@/components/TextInput";
import useCollectionObserver from "@/hooks/useCollectionObserver";
import useKeyListener from "@/hooks/useKeyListener";
import { useAuth } from "@/services/context/AuthContext";
import { googleSignIn } from "@/services/firebase/auth";
import { createDocument, createId } from "@/services/firebase/firestore";
import { MessageType } from "@/types";
import { sanitizeString } from "@/utils/functions";
import { TSDate, UTCDate } from "@/utils/variables";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MessageRow from "./components/MessageRow";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase/config";
import { orderBy, limit, startAfter } from "firebase/firestore";

const messageLimit = 20 as const;

const Pagination = () => {
  const { Auth, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [thread, setThread] = useState<MessageType[]>([]);
  const [afterItem, setAfterItem] = useState<Date | null>(null);

  const Messages = useCollectionObserver<MessageType>({
    Collection: "messages",
    Condition: [
      orderBy("createdAt", "desc"),
      limit(messageLimit),
      ...(afterItem ? [startAfter(afterItem)] : []),
    ],
    Dependencies: [afterItem],
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const maxNegativeScroll =
      e.currentTarget.scrollHeight - e.currentTarget.clientHeight;

    const isAtTop =
      Math.floor(Math.abs(scrollTop)) ===
      Math.floor(Math.abs(maxNegativeScroll));

    if (isAtTop) {
      setAfterItem(thread[thread.length - 1].createdAt);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!Auth) return;
    const sanitized = sanitizeString(message);
    if (typeof message !== "string" || sanitized.trim() === "")
      return setMessageError(true);
    const newMessage: MessageType = {
      authorId: Auth.uid,
      createdAt: TSDate(),
      id: createId("messages"),
      message: sanitized,
    };
    await createDocument<MessageType>({
      Collection: "messages",
      Data: newMessage,
    });
    setMessage("");
    setThread((prevThread) => [newMessage, ...prevThread]);
  }, [message, Auth]);

  const handleSend = useCallback(async () => {
    if (!Auth)
      await googleSignIn().then((response) => {
        if (response.status !== 200) alert(response.message);
        else sendMessage();
      });
    else sendMessage();
  }, [Auth, sendMessage]);

  useKeyListener({
    key: "Enter",
    callback: handleSend,
    dependencies: [handleSend, Auth],
  });

  useEffect(() => {
    setThread((oldMessages) => {
      return [...oldMessages, ...Messages];
    });
  }, [Messages]);

  return (
    <>
      <div
        style={{
          background: Colors.black500,
          top: `${innerHeight / 4}px`,
          left: `calc(50% - 200px)`,
        }}
        className="m-auto br-15px card text-center w-400px h-min-400px h-50vh absolute col gap-5px"
      >
        <div
          onScroll={handleScroll}
          className="col-reverse gap-3px h-100p overflow-y-scroll visible-scrollbar"
        >
          {thread.map((msg) => (
            <MessageRow message={msg} key={msg.id} />
          ))}
        </div>
        <div className="row-center">
          <TextInput
            value={message}
            setValue={(e) => {
              setMessage(e.target.value);
              if (messageError) setMessageError(false);
            }}
            error={messageError}
            inputClassName="bootstrap-input"
            containerClassName="m-3px w-100p"
          />
          <button
            onClick={handleSend}
            className="h-30px w-30px"
            style={{ background: Colors.transparent }}
            type="button"
          >
            <img
              className="h-25px w-25px mr-3px"
              src={Images["ic_send_white"]}
            />
          </button>
        </div>
      </div>

      {Auth ? (
        <button
          style={{
            bottom: "100px",
            left: "calc(50% - 39px)",
            border: "1px solid " + Colors.white,
          }}
          onClick={logout}
          className="absolute br-3px pv-5px ph-15px"
          type="button"
        >
          Logout
        </button>
      ) : null}
    </>
  );
};

export default Pagination;
