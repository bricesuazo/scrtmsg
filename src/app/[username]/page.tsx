export default async function UserPage({
  params: { username },
}: {
  params: { username: string };
}) {
  return <div>{username}</div>;
}
