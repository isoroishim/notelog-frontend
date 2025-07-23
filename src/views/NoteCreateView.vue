<template>
  <div class="note-editor">
    <!-- タイトル入力 - 完璧な統合版 -->
    <div class="title-section">
      <input
        ref="titleInput"
        :value="title"
        placeholder="無題"
        class="title-input"
        @input="handleTitleInput"
        @keydown.prevent.stop="handleTitleKeydown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      />
    </div>

    <!-- コンテンツ表示エリア -->
    <div class="content-section">
      <!-- プレビューモード -->
      <div
        v-if="!isEditing"
        class="content-preview"
        @click="startEditing"
        v-html="renderedContent"
      ></div>

      <!-- 編集モード -->
      <textarea
        v-show="isEditing"
        ref="contentEditor"
        :value="content"
        class="content-editor"
        placeholder="内容を入力..."
        @input.stop="handleContentInput"
        @keydown.stop="handleContentKeydown"
        @blur="handleBlur"
        @focus="handleContentFocus"
      ></textarea>
    </div>

    <!-- ブロック選択メニュー -->
    <Transition name="menu">
      <div v-if="showMenu" class="block-menu-container">
        <div class="menu-overlay" @click="closeMenu"></div>
        <div class="block-menu">
          <div class="menu-header">ブロックタイプを選択</div>
          <div
            v-for="(block, index) in blocks"
            :key="block.type"
            @click="selectBlock(block)"
            @mouseover="hoveredIndex = index"
            :class="['menu-item', { active: hoveredIndex === index }]"
          >
            <span class="block-icon">{{ block.icon }}</span>
            <div class="block-info">
              <span class="block-label">{{ block.label }}</span>
              <span class="block-hint">{{ block.hint }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 保存状態 -->
    <Transition name="fade">
      <div v-if="saving" class="save-indicator">
        <span class="save-icon"></span> 保存中...
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, onMounted } from 'vue';
  import axios from 'axios';

  interface Block {
    type: string;
    label: string;
    icon: string;
    template: string;
    hint: string;
    cursorOffset?: number;
  }

  // 状態管理
  const title = ref('');
  const content = ref('');
  const noteId = ref<number | null>(null);
  const showMenu = ref(false);
  const saving = ref(false);
  const hoveredIndex = ref(0);
  const isEditing = ref(true);
  const isComposing = ref(false);
  const isProcessingEnter = ref(false);

  // DOM参照
  const contentEditor = ref<HTMLTextAreaElement>();
  const titleInput = ref<HTMLInputElement>();

  // セミコロン入力の追跡
  const semicolonTracker = ref({
    isTyping: false,
    position: -1,
  });

  // ブロック定義
  const blocks: Block[] = [
    {
      type: 'h1',
      label: '見出し1',
      icon: 'H1',
      template: '# ',
      hint: '大見出し',
      cursorOffset: 2,
    },
    {
      type: 'h2',
      label: '見出し2',
      icon: 'H2',
      template: '## ',
      hint: '中見出し',
      cursorOffset: 3,
    },
    {
      type: 'h3',
      label: '見出し3',
      icon: 'H3',
      template: '### ',
      hint: '小見出し',
      cursorOffset: 4,
    },
    {
      type: 'list',
      label: 'リスト',
      icon: '•',
      template: '- ',
      hint: '箇条書き',
      cursorOffset: 2,
    },
    {
      type: 'number',
      label: '番号リスト',
      icon: '1.',
      template: '1. ',
      hint: '番号付きリスト',
      cursorOffset: 3,
    },
    {
      type: 'quote',
      label: '引用',
      icon: '"',
      template: '> ',
      hint: '引用ブロック',
      cursorOffset: 2,
    },
    {
      type: 'code',
      label: 'コードブロック',
      icon: '</>',
      template: '```\n\n```',
      hint: 'コード記述',
      cursorOffset: 4,
    },
  ];

  // Markdownを簡易的にHTMLに変換
  const renderedContent = computed(() => {
    if (!content.value) return '<p class="placeholder">内容を入力...</p>';

    let html = content.value
      // HTMLエスケープ
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // 見出し
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      // リスト
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
      // 引用
      .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
      // コードブロック
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // 改行
      .replace(/\n/g, '<br>');

    // リストタグをラップ
    html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
      return `<ul>${match}</ul>`;
    });

    return html;
  });

  // 認証
  const token = localStorage.getItem('access');
  const headers = { Authorization: `Bearer ${token}` };

  // タイトル入力処理（完全分離維持）
  const handleTitleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;

    console.log('=== タイトル入力 ===');
    console.log('新しい値:', `"${newValue}"`);
    console.log('変更前タイトル:', `"${title.value}"`);
    console.log('変更前コンテンツ:', `"${content.value}"`);

    // タイトルのみ更新
    title.value = newValue;

    console.log('変更後タイトル:', `"${title.value}"`);
    console.log('変更後コンテンツ:', `"${content.value}"`);

    // コンテンツに混入チェック
    if (content.value !== '') {
      console.error('❌ 警告: コンテンツに値が混入!', content.value);
    }

    // 自動保存
    debouncedSave();
  };

  // タイトルのキーダウン処理（2個目の完璧な処理を統合）
  const handleTitleKeydown = (event: KeyboardEvent) => {
    console.log('タイトルキーダウン:', event.key);

    if (event.key === 'Enter') {
      console.log('=== Enter押下 - 完璧な処理開始 ===');
      console.log('現在タイトル:', `"${title.value}"`);
      console.log('現在コンテンツ:', `"${content.value}"`);
      console.log('IME変換中:', isComposing.value);

      // IME変換中は何もしない
      if (isComposing.value) {
        console.log('IME変換中のため処理スキップ');
        return;
      }

      // Enterキー処理フラグを立てる
      isProcessingEnter.value = true;
      console.log('Enter処理フラグON');

      // タイトルの値を確定（重要：inputの実際の値を取得）
      const currentTitle = (event.target as HTMLInputElement).value;
      title.value = currentTitle;
      console.log('タイトル確定:', `"${title.value}"`);

      // 遅延してフォーカス移動（ブラウザの処理を完了させる）
      setTimeout(() => {
        console.log('=== 遅延処理開始 ===');

        if (contentEditor.value) {
          focusContent(); // ← ここで関数呼び出し
          console.log('フォーカス移動前 - コンテンツ:', `"${content.value}"`);

          // コンテンツエディタをクリア（重要）
          contentEditor.value.value = '';
          content.value = '';
          console.log('コンテンツクリア完了');

          // 編集モードに切り替え
          isEditing.value = true;

          // フォーカスを設定
          contentEditor.value.focus();
          console.log('フォーカス設定完了');

          // フラグをリセット
          setTimeout(() => {
            isProcessingEnter.value = false;
            console.log('Enter処理フラグOFF');
            console.log('=== Enter処理完了 ===');
          }, 100);
        }
      }, 50);
    }
  };

  // コンテンツフォーカス処理（2個目の処理を統合）
  const handleContentFocus = () => {
    console.log('=== コンテンツフォーカス ===');
    console.log('Enter処理中:', isProcessingEnter.value);

    // Enterキー処理中の場合、初期内容をクリア
    if (isProcessingEnter.value && contentEditor.value) {
      console.log('Enter処理中 - 追加クリア実行');
      contentEditor.value.value = '';
      content.value = '';
      console.log('追加クリア完了');
    }
  };

  // コンテンツ入力処理（完全分離維持）
  const handleContentInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;

    console.log('=== コンテンツ入力 ===');
    console.log('新しい値の長さ:', newValue.length);
    console.log('変更前コンテンツ:', `"${content.value}"`);

    // コンテンツのみ更新
    content.value = newValue;

    console.log('変更後コンテンツ:', `"${content.value}"`);

    // 自動保存
    debouncedSave();
  };

  // コンテンツにフォーカス（シンプル版も維持）
  const focusContent = () => {
    console.log('コンテンツにフォーカス移動開始（シンプル版）');
    console.log('フォーカス前タイトル:', `"${title.value}"`);
    console.log('フォーカス前コンテンツ:', `"${content.value}"`);

    isEditing.value = true;

    nextTick(() => {
      if (contentEditor.value) {
        contentEditor.value.focus();
        const len = content.value.length;
        contentEditor.value.setSelectionRange(len, len);

        console.log('フォーカス後タイトル:', `"${title.value}"`);
        console.log('フォーカス後コンテンツ:', `"${content.value}"`);
        console.log('フォーカス移動完了（シンプル版）');
      }
    });
  };

  // 編集開始
  const startEditing = () => {
    isEditing.value = true;
    nextTick(() => {
      contentEditor.value?.focus();
    });
  };

  // フォーカスが外れた時
  const handleBlur = () => {
    if (!showMenu.value) {
      isEditing.value = false;
    }
  };

  // コンテンツキーダウン処理
  const handleContentKeydown = (event: KeyboardEvent) => {
    console.log('コンテンツキーダウン:', event.key);

    // セミコロン入力を検知
    if (event.key === ';') {
      const textarea = contentEditor.value;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const text = content.value;

      console.log('現在のテキスト:', `"${text}"`);
      console.log('カーソル位置:', cursorPos);

      // 現在行の開始位置を検索
      let lineStart = cursorPos;
      while (lineStart > 0 && text[lineStart - 1] !== '\n') {
        lineStart--;
      }

      // 現在行のテキスト（カーソル位置まで）
      const currentLineBeforeCursor = text.substring(lineStart, cursorPos);
      console.log('現在行:', `"${currentLineBeforeCursor}"`);

      // 空行または行頭でのみメニューを表示
      if (currentLineBeforeCursor.trim() === '') {
        console.log('空行検出 - メニュー表示');

        // セミコロンの入力を完全阻止
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // セミコロンの位置を記録
        semicolonTracker.value = {
          isTyping: true,
          position: cursorPos,
        };

        showMenu.value = true;
        hoveredIndex.value = 0;

        return false;
      }
    }

    // Escapeキーでメニューを閉じる
    if (event.key === 'Escape' && showMenu.value) {
      event.preventDefault();
      closeMenu();
    }

    // メニュー表示中の矢印キー操作
    if (showMenu.value) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        hoveredIndex.value = (hoveredIndex.value + 1) % blocks.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        hoveredIndex.value =
          hoveredIndex.value === 0 ? blocks.length - 1 : hoveredIndex.value - 1;
      } else if (event.key === 'Enter') {
        event.preventDefault();
        selectBlock(blocks[hoveredIndex.value]);
      }
    }
  };

  // ブロック選択処理
  const selectBlock = async (block: Block) => {
    console.log('=== ブロック選択 ===');
    console.log('選択ブロック:', block.type, block.template);

    const textarea = contentEditor.value;
    if (!textarea) return;

    const text = content.value;
    const cursorPos = semicolonTracker.value.position;

    console.log('挿入前テキスト:', `"${text}"`);
    console.log('セミコロン位置:', cursorPos);

    // 現在行の開始位置を検索
    let lineStart = cursorPos;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') {
      lineStart--;
    }

    // 現在行の終了位置を検索
    let lineEnd = cursorPos;
    while (lineEnd < text.length && text[lineEnd] !== '\n') {
      lineEnd++;
    }

    console.log('行開始:', lineStart, '行終了:', lineEnd);

    // 新しいテキストを構築（現在行を置換）
    const beforeLine = text.substring(0, lineStart);
    const afterLine = text.substring(lineEnd);
    const newText = beforeLine + block.template + afterLine;

    console.log('新しいテキスト:', `"${newText}"`);

    // textareaとcontentの両方を更新
    textarea.value = newText;
    content.value = newText;

    // メニューを閉じる
    closeMenu();

    // DOMの更新を待つ
    await nextTick();

    // カーソル位置を設定
    const newCursorPos =
      lineStart + (block.cursorOffset || block.template.length);
    console.log('新しいカーソル位置:', newCursorPos);

    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();

    // セミコロントラッカーをリセット
    semicolonTracker.value = {
      isTyping: false,
      position: -1,
    };

    console.log('=== ブロック挿入完了 ===');

    // 保存をトリガー
    debouncedSave();
  };

  // メニューを閉じる
  const closeMenu = () => {
    console.log('メニューを閉じる');
    showMenu.value = false;
    nextTick(() => {
      contentEditor.value?.focus();
    });
  };

  // 保存処理（デバウンス付き）
  let saveTimer: number;

  const debouncedSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNote, 1000);
  };

  const saveNote = async () => {
    if (!title.value.trim() && !content.value.trim()) {
      console.log('空のため保存スキップ');
      return;
    }

    console.log('=== 保存開始 ===');
    console.log('保存タイトル:', `"${title.value}"`);
    console.log('保存コンテンツ:', `"${content.value}"`);

    saving.value = true;

    try {
      const payload = {
        title: title.value || '無題',
        content: content.value,
      };

      console.log('送信ペイロード:', payload);

      if (noteId.value) {
        await axios.patch(
          `http://127.0.0.1:8000/api/notes/${noteId.value}/`,
          payload,
          { headers },
        );
        console.log('PATCH完了');
      } else {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/notes/',
          payload,
          { headers },
        );
        noteId.value = response.data.id;
        console.log('POST完了 - ノートID:', noteId.value);
      }

      console.log('=== 保存成功 ===');
    } catch (error) {
      console.error('=== 保存エラー ===:', error);
    } finally {
      setTimeout(() => {
        saving.value = false;
      }, 500);
    }
  };

  // マウント時の処理
  onMounted(() => {
    isEditing.value = true;
    console.log('エディタ初期化完了');
  });
</script>
