import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth()

  return (
    <>
      {!session?.user ?
        <>
          <form
            action={async () => {
              "use server";
              await signIn("github")
            }}
          >
            <button type="submit">Signin with GitHub</button>
          </form>
          <hr />
        </> :
        <>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit">Signout</button>
          </form>

          {JSON.stringify(session)}
        </>
      }
    </>
  );
}
