import { getSession } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout(props: React.PropsWithChildren) {
  const session = await getSession();

  if (session) redirect('/');

  return <main className="max-w-screen-md p-4 mx-auto">{props.children}</main>;
}
