// Vuetify のスタイルと機能をインポート
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import type { ThemeDefinition } from 'vuetify';

// ========================================
// テーマ定義
// ========================================

/**
 * Light テーマ（iPhoneメモアプリ風 - 白＋深みある黄）
 */
const notionLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#fffefc',
    surface: '#ffffff',
    primary: '#f7b500',
    secondary: '#e0e0e0',
    onPrimary: '#ffffff',
    onSurface: '#1c1c1e',
    border: 'rgba(0,0,0,0.08)',
    hover: '#f2f2f7',
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    warning: '#f7b500',
  },
};

/**
 * Dark テーマ（iPhoneダークモード風 - Obsidian寄り）
 */
const notionDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#1c1c1e',
    surface: '#2c2c2e',
    primary: '#ffd60a',
    secondary: '#3a3a3c',
    onPrimary: '#000000',
    onSurface: '#f2f2f7',
    border: 'rgba(255,255,255,0.08)',
    hover: '#2c2c2e',
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    warning: '#ffd60a',
  },
};

/**
 * Sepia テーマ（クラシックな紙風 - 暖色系）
 */
const sepiaTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#f6f1e7',
    surface: '#fbf7f2',
    primary: '#a47149',
    secondary: '#dbcbb7',
    onPrimary: '#ffffff',
    onSurface: '#4e433f',
    border: '#dbcbb7',
    hover: '#eee3d5',
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    warning: '#FFC107',
  },
};

/**
 * Evergreen テーマ（森林・落ち着いた緑）
 * - 読書や集中作業向けのナチュラルグリーン配色
 */
const greenLightTheme: ThemeDefinition = {
  dark: false, // 明るいテーマ
  colors: {
    background: '#f6f9f6', // アプリ全体の背景（ごく薄い緑）
    surface: '#ffffff', // カードやモーダルの背景（白）
    primary: '#2f5d50', // メインアクセントカラー（深いグリーン）
    secondary: '#aabbaa', // サブカラー（やや淡い緑）
    onPrimary: '#ffffff', // primary 上の文字色（白）
    onSurface: '#26332f', // surface 上の文字色（黒に近い深緑）
    border: '#d8e3da', // 枠線や区切り線（淡いグリーン）
    hover: '#eaf3ea', // ホバー時の背景色（明るめの緑）
    success: '#4CAF50', // 成功通知カラー（標準緑）
    error: '#F44336', // エラー通知カラー（赤）
    info: '#2196F3', // 情報通知カラー（青）
    warning: '#FFC107', // 警告通知カラー（黄）
  },
};

/**
 * Evergreen Dark テーマ（自然・集中できる深緑ダーク）
 */
const greenDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#000000',
    surface: '#0a0a0a',
    primary: '#6fbf73', // アクセント：やや明るい緑（成功色寄り）
    secondary: '#8fcf9b', // 補助：少し黄緑寄りの淡い緑
    onPrimary: '#000000',
    onSurface: '#a4c8ac', // メインテキスト：淡い青緑グレー（視認性◎）
    border: '#1d2b1f', // ダークグリーン系の縁色
    hover: '#111111',
    success: '#66bb6a',
    error: '#ef5350',
    info: '#26a69a',
    warning: '#ffa726',
  },
};

/**
 * Bluegarden テーマ（落ち着いた青系 - Evergreen の青バージョン）
 * - 読書・思考・ブログ執筆に適した、静かな青配色
 */
const blueLightTheme: ThemeDefinition = {
  dark: false, // 明るいテーマ
  colors: {
    background: '#f4f8fb', // アプリ全体の背景（非常に薄い青）
    surface: '#ffffff', // カード・モーダル背景
    primary: '#2b4c60', // メインアクセント（深い青墨）
    secondary: '#aac7da', // サブカラー（穏やかなブルー）
    onPrimary: '#ffffff', // primary 上の文字色（白）
    onSurface: '#243c4f', // surface 上の文字色（青墨）
    border: '#d3e4ee', // 枠線・区切り線（淡い青）
    hover: '#e5eff6', // ホバー背景（青系）
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
    warning: '#FFC107',
  },
};

/**
 * Blue Dark テーマ（黒×水色 - 落ち着いた近未来系）
 * - 夜間の執筆や集中作業に向いたダークテーマ
 */
const blueDarkTheme: ThemeDefinition = {
  dark: true, // ダークテーマ
  colors: {
    background: '#0d1117', // アプリ全体の背景（黒系）
    surface: '#161b22', // カードやモーダルの背景（黒に近い灰色）
    primary: '#3ecfff', // メインアクセント（水色）
    secondary: '#3ecfff', // サブアクセント（水色）
    onPrimary: '#000000', // primary 上の文字色（黒）
    onSurface: '#a8d1ff', // surface 上の文字色（淡い青）
    border: '#3c4b5e', // 枠線や区切り線（濃い青灰）
    hover: '#1c1f27', // ホバー時の背景（やや明るい黒）
    success: '#4CAF50', // 成功ステータス（緑）
    error: '#F44336', // エラーステータス（赤）
    info: '#2196F3', // 情報ステータス（青）
    warning: '#FFC107', // 警告ステータス（黄）
  },
};

// ========================================
// Vuetify のインスタンスを生成・エクスポート
// ========================================

const vuetify = createVuetify({
  blueprint: md3,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light', // 起動時のテーマ
    themes: {
      light: notionLightTheme,
      dark: notionDarkTheme,
      sepia: sepiaTheme,
      greenlight: greenLightTheme,
      greendark: greenDarkTheme,
      bluelight: blueLightTheme,
      bluedark: blueDarkTheme,
    },
  },
});

export default vuetify;
