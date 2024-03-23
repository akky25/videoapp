import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Button from "~/Components/Button/Button";
import { Logo } from "~/Components/Icons/Icons";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="absolute grid h-full w-full place-items-center bg-gray-200">
      <div className="flex w-80 flex-col items-center rounded-3xl bg-gray-50 px-8 py-5 sm:w-96">
        <Logo className="my-5 block h-14" theme="dark" />
        <form
          method="post"
          action="/api/auth/signin/email"
          className="flex w-full flex-col gap-2"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
            <label htmlFor="email" className="block font-bold text-gray-800">
              Email
            </label>
            <p className="text-sm text-gray-800">
              ※{" "}
              <a
                className="underline hover:cursor-pointer"
                href="https://www.guerrillamail.com/jp/"
                target="_blank"
              >
                使い捨てアドレス
              </a>
              を使用できます
            </p>
          </div>
          <input
            className="block w-full rounded-md border-0 bg-gray-100 p-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            type="email"
            id="email"
            name="email"
          />
          <Button type="submit" className="w-full" size="2xl">
            Sign in with Email
          </Button>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
