import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  return (
    <div>
      <h1>Sign up</h1>
      <form action="/api/auth/sign-up" method="post">
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <Button type="submit">Submit</Button>
      </form>
      <Link href="/sign-in">Sign in</Link>
    </div>
  );
}
