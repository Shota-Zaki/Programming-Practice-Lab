const documentCode = (body = '', title = '') => `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
</head>
<body>
${body}
</body>
</html>`;
const common = [
  { id: 'doctype', label: 'HTML文書として宣言', kind: 'doctype' },
  { id: 'title', label: 'titleにページ名を書く', selector: 'head title' },
  { id: 'heading', label: 'body内にh1の主見出しを書く', selector: 'body h1' },
  { id: 'paragraph', label: 'body内にpの段落を書く', selector: 'body p' },
];
export const lessons = [
  {
    id: 'html01', title: 'HTMLの基本構造',
    objectives: ['headとbodyの役割を区別する', 'タイトル・主見出し・段落を入力する'],
    contentBlocks: [
      { title: '設定と本文を分ける', text: 'HTMLは内容の意味と構造を表す言語です。doctypeはHTML文書の宣言、headは文字コードやページ名などの設定、bodyは表示する本文です。titleはブラウザのタブに表示され、h1は本文に表示されます。' },
      { title: '開始タグと終了タグ', text: '段落は<p>文章</p>と書きます。終了タグの / を忘れないようにしましょう。以下の例を参考に、空のtitleとbodyへ自分のページ名・主見出し・段落を入力してください。' },
    ],
    example: documentCode('  <h1>私の学習ノート</h1>\n  <p>今日からHTMLを学びます。</p>', '学習ノート'),
    starterCode: documentCode(), completionTests: common,
    hints: ['titleはhead、h1とpはbodyの中に書きます。'],
    explanation: '設定と本文が分かれ、ページ名・主見出し・段落を持つ文書になりました。',
  },
  {
    id: 'html02', title: 'タグと属性',
    objectives: ['開始タグに属性を付ける', '言語と要素の識別子を指定する'],
    contentBlocks: [
      { title: '属性は要素の追加情報', text: '属性は開始タグ内に 名前="値" の形で書きます。htmlのlang="ja"は本文の主な言語を示します。idはページ内で要素を識別する名前です。同じidを複数の要素に付けないようにします。' },
      { title: '見出しに名前を付ける', text: 'h1にid="intro"を指定し、自分の見出しと段落を入力してください。属性は終了タグではなく開始タグへ書きます。' },
    ],
    example: documentCode('  <h1 id="intro">自己紹介</h1>\n  <p>ものづくりが好きです。</p>', '自己紹介'),
    starterCode: documentCode('  <h1></h1>\n  <p></p>', '属性の練習'),
    completionTests: [...common,
      { id: 'language', label: 'htmlにlang="ja"を指定', selector: 'html[lang="ja"]', kind: 'exists' },
      { id: 'id', label: 'h1に重複しないid="intro"を指定', selector: 'body h1#intro', kind: 'uniqueId', value: 'intro' }],
    hints: ['<h1 id="intro">主見出し</h1>の形です。'],
    explanation: '属性を使うと、要素の意味や識別情報を追加できます。',
  },
  {
    id: 'html03', title: '見出しと段落',
    objectives: ['主見出しと小見出しで階層を作る', '内容のまとまりごとに段落を分ける'],
    contentBlocks: [
      { title: '見出しは文章の階層', text: 'h1はページ全体の主見出し、h2はその下の節の見出しです。文字を大きくする目的だけで見出しを選ばず、文章の構造で選びます。見た目の調整はCSSで行います。' },
      { title: '段落を分ける', text: 'pは一つの話題のまとまりを表します。ソース内で改行しただけでは、別の段落にはなりません。h1とh2、内容のある二つのpを入力してください。' },
    ],
    example: documentCode('  <h1>学習記録</h1>\n  <p>HTMLの練習を始めました。</p>\n  <h2>今日の発見</h2>\n  <p>見出しで構造を伝えられます。</p>', '学習記録'),
    starterCode: documentCode('  <h1></h1>\n  <p></p>\n  <h2></h2>\n  <p></p>', '見出しと段落'),
    completionTests: [...common,
      { id: 'subheading', label: 'h2に節の見出しを書く', selector: 'body h2' },
      { id: 'paragraphs', label: '内容のあるpを二つ以上書く', selector: 'body p', count: 2 }],
    hints: ['空のpは段落数に数えません。二つの話題をそれぞれのpへ書きましょう。'],
    explanation: '見出しの階層と段落で、読み手が内容のまとまりを理解しやすくなります。',
  },
  {
    id: 'html04', title: '自己紹介ページで総復習',
    objectives: ['文書の設定・属性・見出し・段落を組み合わせる', '自分で入力してプレビューと採点結果を確かめる'],
    contentBlocks: [
      { title: '一つのページにまとめる', text: 'titleにページ名、h1に主見出しとid="intro"、h2に小見出しを書きます。二つ以上のpを使い、自分の好きなものや学びたいことを紹介しましょう。実名などの個人情報を使う必要はありません。' },
      { title: '表示と構造を両方確かめる', text: 'プレビューに文字が表示されても、文書構造が適切とは限りません。headとbodyの役割、lang属性、段落の分け方を見直してから完了条件を確認してください。' },
    ],
    example: documentCode('  <h1 id="intro">こんにちは</h1>\n  <p>読書が好きです。</p>\n  <h2>学びたいこと</h2>\n  <p>自分のサイトを作りたいです。</p>', '私のページ'),
    starterCode: documentCode(),
    completionTests: [...common,
      { id: 'language', label: 'htmlにlang="ja"を指定', selector: 'html[lang="ja"]', kind: 'exists' },
      { id: 'id', label: 'h1に重複しないid="intro"を指定', selector: 'body h1#intro', kind: 'uniqueId', value: 'intro' },
      { id: 'subheading', label: 'h2に小見出しを書く', selector: 'body h2' },
      { id: 'paragraphs', label: '内容のあるpを二つ以上書く', selector: 'body p', count: 2 }],
    hints: ['前の教材へ戻って復習できます。各レッスンの入力は別々に保存されます。'],
    explanation: '第1章のまとめができました。章進捗が4 / 4になると、第1章の全演習が完了です。',
  },
].map((lesson, index, all) => ({ ...lesson, courseId: 'web-foundation', chapterId: 'html-chapter01', nextLessonId: all[index + 1]?.id ?? null }));
