<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="400">
      <v-card-text class="text-center">
        <v-progress-circular indeterminate color="primary" />
        <p class="mt-4">認証処理中...</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from '@/plugins/axios';

  const route = useRoute();

  onMounted(async () => {
    try {
      // URLからパラメータを取得
      const code = route.query.code as string;
      const error = route.query.error as string;
      const errorDescription = route.query.error_description as string;

      console.log('認証コールバック開始:', {
        code: code?.substring(0, 10) + '...',
        error,
      });

      // エラーがある場合の処理
      if (error) {
        console.error('Google OAuth error:', { error, errorDescription });

        const errorMessage =
          errorDescription || error || 'Google認証でエラーが発生しました';

        window.opener?.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error: errorMessage,
          },
          window.location.origin,
        );
        window.close();
        return;
      }

      // 認証コードの確認
      if (!code) {
        throw new Error('認証コードが取得できませんでした');
      }

      console.log('Google認証コード取得成功');

      // まずGETでエンドポイントの存在確認
      console.log('エンドポイント確認中...');

      try {
        const testResponse = await axios.get('/api/auth/google/token/');
        console.log('エンドポイント確認OK:', testResponse.data);
      } catch (testError) {
        console.error('エンドポイント確認エラー:', testError);
      }

      // カスタムAPIエンドポイントを使用
      console.log('POSTリクエスト送信中...');
      const response = await axios.post('/api/auth/google/token/', {
        code: code,
      });

      console.log('Google認証API レスポンス:', response.data);

      // レスポンスの構造を確認してトークンを取得
      const responseData = response.data;
      const { access, refresh, user } = responseData;

      if (!access) {
        throw new Error('アクセストークンが取得できませんでした');
      }

      // ユーザー情報の取得
      const userName = user?.name || user?.email || 'ユーザー';

      console.log('認証成功:', {
        accessToken: access.substring(0, 10) + '...',
        userName,
      });

      // 親ウィンドウに認証成功を通知
      window.opener?.postMessage(
        {
          type: 'GOOGLE_AUTH_SUCCESS',
          access: access,
          refresh: refresh,
          name: userName,
        },
        window.location.origin,
      );

      // ポップアップを閉じる
      window.close();
    } catch (error) {
      console.error('Google認証処理エラー:', error);

      let errorMessage = '認証処理中にエラーが発生しました';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // axios エラーの場合の型定義
        interface AxiosErrorType {
          response?: {
            data?:
              | string
              | {
                  error?: string;
                  details?: string;
                  detail?: string;
                  non_field_errors?: string[];
                  [key: string]: unknown;
                };
            status?: number;
            statusText?: string;
          };
          message?: string;
        }

        const axiosError = error as AxiosErrorType;

        if (axiosError.response) {
          const { status, statusText, data } = axiosError.response;
          console.error('HTTP エラー:', { status, statusText, data });

          if (status === 404) {
            errorMessage =
              'APIエンドポイントが見つかりません。サーバー設定を確認してください。';
          } else if (data) {
            if (typeof data === 'string') {
              errorMessage = data;
            } else if (data && typeof data === 'object') {
              if (data.error) {
                errorMessage = data.error;
                if (data.details) {
                  errorMessage += ` (詳細: ${data.details})`;
                }
              } else if (data.detail) {
                errorMessage = data.detail;
              } else if (data.non_field_errors) {
                errorMessage = data.non_field_errors.join(', ');
              } else {
                errorMessage = JSON.stringify(data);
              }
            }
          }
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      }

      // 親ウィンドウにエラーを送信
      window.opener?.postMessage(
        {
          type: 'GOOGLE_AUTH_ERROR',
          error: errorMessage,
        },
        window.location.origin,
      );

      window.close();
    }
  });
</script>
