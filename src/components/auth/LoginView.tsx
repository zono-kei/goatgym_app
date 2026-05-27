import React, { useState } from 'react';
import { useAppStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import goatLogo from '../../assets/images/goat_logo_1779718162447.png';

export default function LoginView() {
  const { login, loginWithEmail, resetPassword } = useAppStore();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await login();
    } catch (e: any) {
      console.error(e);
      setError('Googleログインに失敗しました');
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const formattedEmail = loginId.includes('@') ? loginId : `${loginId}@goat-hp.local`;
      if (isResetMode) {
        await resetPassword(formattedEmail);
        setMessage('パスワード再設定のメールを送信しました。受信トレイをご確認ください。');
      } else {
        await loginWithEmail(formattedEmail, password);
      }
    } catch (e: any) {
      console.error(e);
      if (isResetMode) {
        setError('再設定メールの送信に失敗しました。メールアドレスが正しいか確認してください。');
      } else {
        setError('ログインID、またはパスワードが間違っています。');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-gray-900">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full shadow-md bg-white border border-gray-100">
            <img src={goatLogo} alt="GOAT Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">GOAT PERSONAL GYM</h1>
          <p className="text-sm text-gray-500">会員専用アプリケーション</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
          <form onSubmit={handleAuthAction} className="space-y-4">
            {error && <p className="text-sm text-rose-500 font-medium bg-rose-50 p-2 rounded text-center">{error}</p>}
            {message && <p className="text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded text-center">{message}</p>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ログインID {isResetMode && '(Email)'}</label>
              <Input 
                type="text" 
                placeholder="ログインID" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>
            {!isResetMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">パスワード</label>
                <Input 
                  type="password" 
                  placeholder="パスワード" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <Button type="submit" variant="gold" className="w-full">
              {isResetMode ? 'パスワード再設定メールを送信' : 'ログイン'}
            </Button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => { setIsResetMode(!isResetMode); setError(''); setMessage(''); }}
                className="text-xs text-gray-500 hover:text-gray-900 underline"
              >
                {isResetMode ? 'ログイン画面に戻る' : 'パスワードを忘れた場合'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              管理者用ログイン (Google)
            </button>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto">
              ※管理者は「管理者用ログイン (Google)」ボタンからパスワードなしでログインできます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
