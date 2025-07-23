<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from '@/plugins/axios';
  import type { AxiosError } from 'axios';

  const route = useRoute();

  onMounted(async () => {
    try {
      const code = route.query.code as string;
      const error = route.query.error as string;
      const errorDescription = route.query.error_description as string;

      console.log('認証コールバック開始:', {
        code: code?.substring(0, 10) + '...',
        error,
      });

      if (error) {
        const message =
          errorDescription || error || 'Google認証でエラーが発生しました';
        notifyError(message);
        return;
      }

      if (!code) {
        throw new Error('認証コードが取得できませんでした');
      }

      console.log('Google認証コード取得成功');

      // エンドポイント確認（GET）
      try {
        const testResponse = await axios.get('/api/auth/google/token/');
        console.log('エンドポイント確認OK:', testResponse.data);
      } catch (testError) {
        console.warn('エンドポイント確認エラー:', testError);
      }

      // トークン取得（POST）
      const response = await axios.post('/api/auth/google/token/', {
        code: code,
      });

      const { access, refresh, user } = response.data;

      if (!access) {
        throw new Error('アクセストークンが取得できませんでした');
      }

      const userName = user?.name || user?.email || 'ユーザー';

      console.log('認証成功:', {
        accessToken: access.substring(0, 10) + '...',
        userName,
      });

      window.opener?.postMessage(
        {
          type: 'GOOGLE_AUTH_SUCCESS',
          access,
          refresh,
          name: userName,
        },
        window.location.origin,
      );

      window.close();
    } catch (err) {
      const errorMessage = parseAuthError(err);
      notifyError(errorMessage);
    }
  });

  /**
   * エラーオブジェクトを解析してメッセージを抽出
   */
  function parseAuthError(err: unknown): string {
    if (err instanceof Error) {
      return err.message;
    }

    const error = err as AxiosError;

    if (error.response) {
      const { status, statusText, data } = error.response;

      console.error('HTTP エラー:', { status, statusText, data });

      if (status === 404) {
        return 'APIエンドポイントが見つかりません。サーバー設定を確認してください。';
      }

      if (typeof data === 'string') {
        return data;
      }

      if (typeof data === 'object' && data !== null) {
        const body = data as Record<string, unknown>;

        if (typeof body.error === 'string') {
          let message = body.error;
          if (typeof body.details === 'string') {
            message += `（詳細: ${body.details}）`;
          }
          return message;
        }

        if (typeof body.detail === 'string') {
          return body.detail;
        }

        if (Array.isArray(body.non_field_errors)) {
          return body.non_field_errors.join(', ');
        }

        return JSON.stringify(body);
      }
    }

    if (error.message) {
      return error.message;
    }

    return '認証処理中に不明なエラーが発生しました';
  }

  /**
   * 親ウィンドウにエラー通知して閉じる
   */
  function notifyError(message: string) {
    window.opener?.postMessage(
      {
        type: 'GOOGLE_AUTH_ERROR',
        error: message,
      },
      window.location.origin,
    );
    window.close();
  }
</script>
