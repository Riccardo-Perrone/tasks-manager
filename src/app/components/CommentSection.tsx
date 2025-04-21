import { Comment } from "@/src/utils/types";
import React, { MouseEvent, useState } from "react";
import InputCustom from "./InputCustom";
import api from "@/src/lib/axios";
import { useToast } from "@/src/utils/ToastProvider";
import Cookies from "js-cookie";

//icons
import { IoSend } from "react-icons/io5";
import { formattedDate } from "@/src/utils/formattedDate";

interface Props {
  comments: Comment[];
  handleCreate: () => void;
  task_id: string;
}

function CommentSection({ comments, task_id, handleCreate }: Props) {
  const { showToast } = useToast();

  const [newComment, setNewComment] = useState<string>("");

  const createNewComment = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const author_id = Cookies.get("user_id"); // Recupera l'id dal cookie
    console.log(author_id);

    if (!author_id) {
      showToast("Utente non autenticato", "error");
      return;
    }

    try {
      await api.post("/comments", {
        message: newComment,
        task_id: task_id,
        author_id,
      });
      setNewComment("");
      handleCreate();
    } catch (error) {
      showToast(`Errore creazione task, Riprovare`, "error");
    }
  };

  return (
    <div className="border-y border-gray-400 py-4">
      <InputCustom
        placeholder="Aggiungi commento..."
        name="comments"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        min={0}
        endAdornment={
          <button
            onClick={createNewComment}
            className={`${
              newComment
                ? "opacity-100 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <IoSend />
          </button>
        }
      />
      <div className="my-4">
        {comments?.map((e) => (
          <div className="flex flex-col border-2 border-white p-1 mb-2 text-sm rounded">
            <div className="text-xs mx-2 italic flex justify-between">
              <span className="font-bold">{e.username}</span>
              <span>{formattedDate(e.created_at)}</span>
            </div>
            {e.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
