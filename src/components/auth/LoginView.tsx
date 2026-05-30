import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import goatLogo from "../ui/goatlogo.png";
import zonoLogo from "../../zono.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function LoginView() {
  const { login, loginWithEmail, resetPassword } = useAppStore();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // Check for common in-app browsers like LINE, Instagram, Facebook, Twitter, etc.
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const inAppBrowserPattern =
      /Instagram|FBAN|FBAV|Line|Twitter|MicroMessenger|Snapchat|TikTok/i;

    // Check for iPhone/iPad/Android general WebView
    // Often contains "Safari" and "Version", but if it's an in-app browser, it usually lacks "Safari" but has "iPhone"
    // Simplified specific platform check

    if (inAppBrowserPattern.test(userAgent)) {
      setIsInAppBrowser(true);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await login();
    } catch (e: any) {
      console.error(e);
      setError("Googleログインに失敗しました");
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      let formattedEmail = loginId.includes("@")
        ? loginId
        : `${loginId}@goat-hp.local`;

      try {
        const mappingDoc = await getDoc(doc(db, "authMappings", loginId));
        if (mappingDoc.exists()) {
          formattedEmail = mappingDoc.data().email;
        }
      } catch (err) {
        // Fallback to default if not permitted or not found
      }

      if (isResetMode) {
        await resetPassword(formattedEmail);
        setMessage(
          "パスワード再設定のメールを送信しました。受信トレイをご確認ください。",
        );
      } else {
        await loginWithEmail(formattedEmail, password);
      }
    } catch (e: any) {
      console.error(e);
      if (isResetMode) {
        setError(
          "再設定メールの送信に失敗しました。メールアドレスが正しいか確認してください。",
        );
      } else {
        setError("ログインID、またはパスワードが間違っています。");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-gray-900">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full shadow-md bg-white border border-gray-100">
            <img
              src={goatLogo}
              alt="GOAT Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">
            GOAT PERSONAL GYM
          </h1>
          <p className="text-sm text-gray-500">会員専用アプリケーション</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xl relative mt-4">
          {isInAppBrowser && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm">
              <h3 className="text-sm font-bold text-orange-800 mb-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 pb-[1px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                外部ブラウザで開いてください
              </h3>
              <p className="text-xs text-orange-700 leading-relaxed font-medium">
                LINEやInstagramなどのアプリ内ブラウザでは、Googleログインがブロックされる場合があります。エラー(disallowed_useragent)が出た場合は、画面右上などのメニューから
                <span className="font-bold border-b border-orange-700">
                  「Safariで開く」
                </span>
                または
                <span className="font-bold border-b border-orange-700">
                  「デフォルトのブラウザで開く」
                </span>
                をお試しください。
              </p>
            </div>
          )}

          <form onSubmit={handleAuthAction} className="space-y-4">
            {error && (
              <p className="text-sm text-rose-500 font-medium bg-rose-50 p-2 rounded text-center">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded text-center">
                {message}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                ログインID {isResetMode && "(Email)"}
              </label>
              <Input
                type="text"
                placeholder="ログインID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                name="username"
                autoComplete="username"
                required
              />
            </div>
            {!isResetMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <Input
                  type="password"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </div>
            )}

            <Button type="submit" variant="gold" className="w-full">
              {isResetMode ? "パスワード再設定メールを送信" : "ログイン"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(!isResetMode);
                  setError("");
                  setMessage("");
                }}
                className="text-xs text-gray-500 hover:text-gray-900 underline"
              >
                {isResetMode ? "ログイン画面に戻る" : "パスワードを忘れた場合"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors py-3 px-6 rounded-md hover:bg-gray-50 font-medium border border-transparent hover:border-gray-200"
            >
              Googleアカウントでログイン
            </button>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto text-left">
              ※管理者は上記の「Googleアカウントでログイン」をご利用ください。
              <br />
              ※スマホ(Safari等)でエラーになる場合は、メールアドレスとパスワードでのログインも可能です。パスワードがない場合は「パスワードを忘れた場合」から設定してください。
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-8 mb-4 opacity-90 transition-opacity duration-500">
          <div className="relative mb-3 flex flex-col items-center">
            <div className="bg-white text-gray-800 text-sm py-2 px-4 rounded-full shadow-lg border border-gray-100 font-bold z-10 whitespace-nowrap mb-2 relative animate-bounce-slow">
              ログインしてね！✨
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
            </div>
            <img
              src={zonoLogo}
              alt="Zono"
              className="h-24 md:h-32 object-contain drop-shadow-xl"
            />
          </div>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2 bg-white/80 px-4 py-1 rounded-full">
            Powered By Zono
          </p>
        </div>
      </div>
    </div>
  );
}
