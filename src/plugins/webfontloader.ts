// plugins/webfontloader.js

/**
 * Google Fonts を動的に読み込む関数
 * 使用フォント：Roboto（各ウェイト）
 * ※ 初期化時に実行してフォント適用を行う
 */
export async function loadFonts() {
  // Web Font Loader を非同期でインポート
  const webFontLoader = await import(
    /* webpackChunkName: "webfontloader" */
    'webfontloader'
  );

  // Roboto フォントを読み込む
  webFontLoader.load({
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap'],
    },
  });
}
