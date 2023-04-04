import { useRouter } from "next/router";

export default function EmailSignin() {
  const { query } = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="shadowsm:p-6 w-full max-w-sm rounded-lg border  border-surface-2 bg-surface-1 p-4 md:p-8">
          <form
            className="space-y-6"
            action="/api/auth/callback/email"
            method="get"
          >
            <h1 className="text-xl font-medium text-text-1">Email Sent</h1>
            <p>
              Check your inbox! If we found your email address ({query.email})
              you'll have a magic code to login waiting for you. Sometimes this
              can land in SPAM! While we hope that isn't the case if it doesn't
              arrive in a minute or three, please check.
            </p>
            {/* <input type="hidden" name="callbackUrl" value={query.callbackUrl} />
            <input type="hidden" name="email" value={query.email} /> */}
            <div>
              <label
                htmlFor="token"
                className="mb-2 block text-sm font-medium text-text-1"
              >
                Magic code:
              </label>
              <input
                name="token"
                id="token"
                className="block w-full rounded-lg border border-surface-4 bg-surface-3  p-2.5 text-sm text-text-1 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="abc123"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-2 py-2.5 text-text-1 hover:bg-brand-1"
            >
              Login to your account
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
