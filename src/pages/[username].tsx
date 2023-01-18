import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";

const UsernamePage = () => {
  const sendMessageMutation = api.message.sendMessageToUsername.useMutation();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { username } = router.query;

  if (!username || typeof username !== "string") return;

  const user = api.user.getUserByUsername.useQuery({ username });

  if (user.isLoading) return <>Loading...</>;
  if (!user.data) return <>Username doesn&apos;t exists.</>;

  return (
    <div>
      <h1>Send message to @{user.data.username}</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessageMutation.mutateAsync({ username, message });
          setMessage("");
        }}
      >
        <input
          type="text"
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          disabled={sendMessageMutation.isLoading}
        />
        <button type="submit" disabled={sendMessageMutation.isLoading}>
          {sendMessageMutation.isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default UsernamePage;
