import { ref, watchEffect } from 'vue';

// ローカルストレージのキー名定義
const accessTokenKey = 'access_token';
const refreshTokenKey = 'refresh_token';
const usernameKey = 'username';

// 認証状態（リアクティブ）
const isLoggedIn = ref<boolean>(!!localStorage.getItem(accessTokenKey));
const username = ref<string | null>(localStorage.getItem(usernameKey));

/**
 * 認証情報を管理するカスタムComposable
 */
export const useAuth = () => {
  /**
   * ログイン処理：トークンとユーザー名を保存し、状態を更新
   */
  const login = (access: string, refresh: string, name: string) => {
    localStorage.setItem(accessTokenKey, access);
    localStorage.setItem(refreshTokenKey, refresh);
    localStorage.setItem(usernameKey, name);
    isLoggedIn.value = true;
    username.value = name;
  };

  /**
   * ログアウト処理：全ての認証情報を削除
   */
  const logout = () => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    localStorage.removeItem(usernameKey);
    isLoggedIn.value = false;
    username.value = null;
  };

  /**
   * アクセストークンを取得（nullの可能性あり）
   */
  const getAccessToken = () => localStorage.getItem(accessTokenKey);

  /**
   * ローカルストレージの変更を反映（手動変更や他タブ対策）
   */
  watchEffect(() => {
    isLoggedIn.value = !!localStorage.getItem(accessTokenKey);
    username.value = localStorage.getItem(usernameKey);
  });

  return {
    isLoggedIn,
    username,
    login,
    logout,
    getAccessToken,
  };
};
