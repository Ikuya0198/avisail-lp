# Avisail LP 更新ログ＆対応項目リスト

**最終更新日**: 2026年2月3日
**Gitプッシュ**: ✅ 完了

---

## 📋 今回の更新内容サマリー

### 1. チーム紹介セクション追加
**追加ファイル**:
- `en/about.html` - 英語版Aboutページ
- `ja/about.html` - 日本語版Aboutページ

**内容**:
- 4名分のチームメンバーカードテンプレート
- プロフィール写真（円形、150x150px）
- 氏名、役職、専門分野、経歴フィールド

### 2. 製品ページスクリーンショットギャラリー追加
**追加ファイル**:
- `maritime/cyber-accountability-en.html`
- `maritime/cyber-accountability-ja.html`
- `security/adcs-en.html`
- `security/adcs-ja.html`

**内容**:
- Maritime Cyber Accountability: ダッシュボード、エビデンス管理、レポート生成、インシデント対応の4画面
- ADCS: アタックサーフェス、OSINT分析、リスクスコアリング、対応計画の4画面

---

## ⚠️ あなたの対応が必要な項目

### 🔴 優先度：高

#### 1. チームメンバー情報の入力
**場所**: `en/about.html` と `ja/about.html`
**検索文字列**: `[Name]`, `[氏名]`

**必要な情報**:
- [ ] プロフェッショナルな顔写真（150x150px推奨、正方形）
- [ ] フルネーム
- [ ] 役職・ポジション
- [ ] 専門分野（3-5つのキーワード）
- [ ] 経歴（2-3文、主な実績を含む）

**画像の差し替え方法**:
```html
<!-- 現在（SVGプレースホルダー） -->
<div style="width: 150px; height: 150px; ... background: linear-gradient(...);">
  <svg>...</svg>
</div>

<!-- 差し替え後 -->
<div style="width: 150px; height: 150px; ...">
  <img src="../images/team/member-name.jpg" alt="氏名" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
</div>
```

#### 2. 製品スクリーンショットの追加

**Maritime Cyber Accountability**:
- [ ] メインダッシュボード（1920x1080px）
- [ ] エビデンス管理画面（1280x960px）
- [ ] レポート生成画面（1280x960px）
- [ ] インシデント対応画面（1280x960px）

**ADCS**:
- [ ] アタックサーフェス可視化（1280x960px）
- [ ] OSINT分析結果（1280x960px）
- [ ] リスクスコアリング（1280x960px）
- [ ] インシデント対応プレイブック（1280x960px）

**ファイル保存先**: `images/screenshots/` ディレクトリを作成推奨

**差し替え方法**:
```html
<!-- プレースホルダーのdiv全体を削除して以下に置き換え -->
<img src="../images/screenshots/dashboard-main.png" alt="ダッシュボード画面" style="width: 100%; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.3);">
```

#### 3. Google Analytics/GTM IDの設定
**場所**: `index.html` と `index.ja.html`
**検索文字列**: `GTM-XXXXXXX`, `G-XXXXXXXXXX`

**手順**:
1. Google Analytics 4でプロパティを作成
2. Google Tag Managerでコンテナを作成
3. プレースホルダーIDを実際のIDに置換

```javascript
// GTM ID（例: GTM-ABC123）
'https://www.googletagmanager.com/gtm.js?id=GTM-ABC123'

// GA4測定ID（例: G-ABC12345XY）
gtag('config', 'G-ABC12345XY');
```

### 🟡 優先度：中

#### 4. ニュースレター統合
**場所**: `includes/footer-en.html`, `includes/footer-ja.html`
**検索文字列**: `TODO: Replace with actual newsletter service`

**推奨サービス**:
- Mailchimp
- ConvertKit
- SendGrid

**統合手順**:
1. サービスのAPIキーを取得
2. フォーム送信処理をAPIエンドポイントに接続
3. サンクスメッセージ表示の実装

#### 5. リードマグネットPDFの作成
**必要なファイル**:
- [ ] `resources/pdfs/maritime-security-guide-en.pdf`
- [ ] `resources/pdfs/maritime-security-guide-ja.pdf`
- [ ] `resources/pdfs/vessel-purchase-checklist.pdf`

**ランディングページ**:
- `resources/maritime-security-guide-en.html`
- `resources/maritime-security-guide-ja.html`
- `resources/vessel-checklist-en.html`

**フォーム送信後の処理を実装**:
- メール送信（PDFを添付）
- ダウンロードリンク表示

#### 6. 動画コンテンツの作成・埋め込み
**場所**: `maritime/cyber-accountability-en.html`, `maritime/cyber-accountability-ja.html`
**検索文字列**: `<!-- YouTube embed will go here -->`

**必要な動画**:
- [ ] Maritime Cyber Accountability製品デモ（3-5分）
- [ ] ADCS評価プロセス説明（2-3分）

**埋め込み方法**:
```html
<iframe
  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

### 🟢 優先度：低（将来的に）

#### 7. 追加ブログ記事の執筆
**テンプレート**: `blog/template-blog-post.html`

**作成予定記事**（ブログインデックスにプレースホルダーあり）:
- [ ] 「中小企業が犯す5つのサイバーセキュリティミス」
- [ ] 「船舶購入チェックリスト：7つの重要ステップ」
- [ ] 「AIが海事オペレーションをどう変革するか」

**保存場所**: `blog/[category]/[article-slug]-[lang].html`

---

## 📁 ディレクトリ構造（新規追加分）

```
avisail-lp/
├── blog/
│   ├── index-en.html          ✅ 作成済み
│   ├── index-ja.html          ✅ 作成済み
│   ├── template-blog-post.html ✅ 作成済み
│   └── maritime/
│       └── ism-code-cyber-risk-management-en.html ✅ 作成済み
├── resources/
│   ├── maritime-security-guide-en.html ✅ 作成済み
│   ├── maritime-security-guide-ja.html ✅ 作成済み
│   ├── vessel-checklist-en.html ✅ 作成済み
│   └── pdfs/               ❌ 作成が必要
│       ├── maritime-security-guide-en.pdf
│       ├── maritime-security-guide-ja.pdf
│       └── vessel-purchase-checklist.pdf
└── images/
    ├── screenshots/        ❌ 作成が必要
    │   ├── dashboard-main.png
    │   ├── evidence-management.png
    │   ├── report-generation.png
    │   └── incident-response.png
    └── team/              ❌ 作成が必要
        ├── member1.jpg
        ├── member2.jpg
        ├── member3.jpg
        └── member4.jpg
```

---

## 🔍 検索のヒント

各プレースホルダーを探す際の検索文字列：

| 項目 | 検索文字列 |
|------|-----------|
| チームメンバー（EN） | `[Name]` または `[Title / Position]` |
| チームメンバー（JA） | `[氏名]` または `[役職・ポジション]` |
| スクリーンショット | `Screenshot Needed` または `スクリーンショット追加が必要` |
| Google Analytics | `GTM-XXXXXXX` |
| ニュースレター統合 | `TODO: Replace with actual newsletter` |
| 動画埋め込み | `YouTube embed will go here` |

---

## ✅ チェックリスト（コピーして使用）

```markdown
### 即座に対応
- [ ] チーム写真4枚を用意（150x150px）
- [ ] チームメンバー情報を記入（氏名、役職、専門分野、経歴）
- [ ] 製品スクリーンショット8枚を作成・配置
- [ ] Google Analytics & GTM IDを設定

### 2週間以内
- [ ] ニュースレターサービス（Mailchimp等）と統合
- [ ] リードマグネットPDF 3種類を作成
- [ ] 製品デモ動画を撮影・埋め込み

### 1ヶ月以内
- [ ] ブログ記事3本を執筆
- [ ] 全ページの動作確認
- [ ] モバイル表示の最終チェック
```

---

## 📞 サポート

質問や不明点があれば、このファイルと一緒にissueを作成してください。

**Git リポジトリ**: https://github.com/Ikuya0198/avisail-lp
**最終コミット**: 1ace022 - 製品ページに詳細スクリーンショットギャラリーを追加
