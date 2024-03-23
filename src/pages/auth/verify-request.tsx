import { Logo } from "~/Components/Icons/Icons";

export default function VerifyRequest() {
  return (
    <div className="absolute grid h-full w-full place-items-center bg-gray-200">
      <div className="flex w-80 flex-col items-center rounded-3xl bg-gray-50 px-8 py-5 text-gray-800 sm:w-96">
        <Logo className="my-5 block h-14" theme="dark" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">メールをチェックしよう 🎉</h1>
          <p className="text-sm">
            サインイン リンクがメールアドレスに送信されました。
          </p>
        </div>
      </div>
    </div>
  );
}
