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
const learningImage = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect x="25" y="8" width="70" height="64" rx="4" fill="#2563eb"/><path d="M40 28h40M40 40h40M40 52h25" stroke="white" stroke-width="4"/></svg>');
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
  {
    id: 'html05', chapterId: 'html-chapter02', title: '意味のあるページ構造',
    objectives: ['ページ全体と節の役割を区別する', '主な内容をmainにまとめる'],
    contentBlocks: [
      { title: '内容の役割をタグで伝える', text: 'headerは導入、mainはページの主な内容、footerは末尾の補足を表します。この演習ではbodyの直下にそれぞれ置き、mainは一つにします。見た目を変えるためではなく、内容の役割に合わせてタグを選びましょう。' },
      { title: '見出しのあるまとまり', text: 'sectionは一つの話題をまとめる要素です。mainの中にページのh1とsectionを置き、sectionの中にh2とpを書いてください。divは特別な意味を持たないまとまりで、sectionの代わりに使うとこの演習の条件を満たしません。' },
    ],
    example: documentCode('  <header>学習ノート</header>\n  <main>\n    <h1>今日の学び</h1>\n    <section>\n      <h2>HTMLの役割</h2>\n      <p>内容の構造を伝えます。</p>\n    </section>\n  </main>\n  <footer>学習メモの終わり</footer>', '意味のある構造'),
    starterCode: documentCode('  <header></header>\n  <main>\n    <h1></h1>\n    <section></section>\n  </main>\n  <footer></footer>', '構造の練習'),
    completionTests: [...common,
      { id: 'header', label: 'body直下のheaderに導入を書く', selector: 'body > header' },
      { id: 'main', label: 'mainを一つだけbody直下に置き、中にh1を書く', kind: 'main' },
      { id: 'section', label: 'main内の同じsectionにh2とpを書く', kind: 'section' },
      { id: 'footer', label: 'body直下のfooterに補足を書く', selector: 'body > footer' }],
    hints: ['sectionの開始タグと終了タグの間に、h2とpの両方を入れましょう。'],
    explanation: '主な内容と各節を、意味のあるタグで整理できました。',
  },
  {
    id: 'html06', chapterId: 'html-chapter02', title: 'リスト・リンク・画像',
    objectives: ['箇条書きと手順を使い分ける', '移動先のあるリンクと代替文のある画像を作る'],
    contentBlocks: [
      { title: '箇条書きと手順', text: 'ulは順序のない一覧、olは順序に意味のある手順です。項目はそれぞれの中にliで書きます。好きなことをulに二つ、学習手順をolに二つ書いてください。' },
      { title: 'リンク先と画像の意味', text: 'aのhref="#steps"は同じページのid="steps"へ移動します。リンク文には移動先が分かる言葉を書き、対応するIDを一つだけ付けましょう。imgにはsrcとaltを書きます。この教材のdata画像はコード内に画像を含むので外部通信が不要です。altには情報画像の意味を書きます。装飾だけの画像は空altを使う場合もありますが、今回は意味を伝える画像です。' },
    ],
    example: documentCode('  <h1>学習の計画</h1>\n  <p>好きなことを題材に学びます。</p>\n  <ul><li>読書</li><li>絵を描くこと</li></ul>\n  <a href="#steps">学習手順へ</a>\n  <ol id="steps"><li>教材を読む</li><li>入力して確かめる</li></ol>\n  <img src="' + learningImage + '" alt="学習計画を表す青いノート" width="120" height="80">', '学習の計画'),
    starterCode: documentCode('  <h1>学習の計画</h1>\n  <p>好きなことを題材に学びます。</p>\n  <ul></ul>\n  <a href="">学習手順へ</a>\n  <ol id="steps"></ol>\n  <img src="' + learningImage + '" alt="" width="120" height="80">', '一覧と画像'),
    completionTests: [...common,
      { id: 'unordered', label: 'ul内に内容のある直下liを二つ以上書く', selector: 'body ul', kind: 'list' },
      { id: 'ordered', label: 'ol内に内容のある直下liを二つ以上書く', selector: 'body ol', kind: 'list' },
      { id: 'link', label: 'リンク文と、一意の移動先IDを持つページ内リンクを作る', kind: 'fragmentLink' },
      { id: 'image', label: '教材の画像に意味を伝えるaltを書く', kind: 'image', value: learningImage }],
    hints: ['href="#steps"とid="steps"を対応させます。liはulまたはolのすぐ内側へ置きましょう。画像のsrcはそのまま使えます。'],
    explanation: '一覧の順序、リンク先、画像の意味がHTMLで伝わるようになりました。',
  },
  {
    id: 'html07', chapterId: 'html-chapter02', title: '入力しやすいフォーム',
    objectives: ['入力欄とラベルを対応させる', '入力の種類と必須条件を指定する'],
    contentBlocks: [
      { title: '入力欄に名前を付ける', text: 'formは入力をまとめる要素です。labelは何を入力するかを示します。labelのforとinputのidを同じ値にすると対応します。idはページ内で重複させません。placeholderは入力例であり、labelの代わりにはなりません。' },
      { title: '種類・送信名・必須条件', text: '名前欄はtype="text"、メール欄はtype="email"にします。nameは送信データの項目名、requiredは必須入力を表します。両方の入力に異なるnameとrequiredを付け、form内にtype="submit"のボタンを置きましょう。この演習は構造だけを確認し、送信しません。実名や本物のメールアドレスは入力しないでください。' },
    ],
    example: documentCode('  <h1>練習用フォーム</h1>\n  <p>架空の内容で練習します。送信はできません。</p>\n  <form>\n    <label for="nickname">呼び名</label>\n    <input id="nickname" name="nickname" type="text" required>\n    <label for="email">メールアドレス</label>\n    <input id="email" name="email" type="email" required>\n    <button type="submit">内容を送信</button>\n  </form>', 'フォームの練習'),
    starterCode: documentCode('  <h1>練習用フォーム</h1>\n  <p>架空の内容で練習します。送信はできません。</p>\n  <form>\n    <input type="text">\n    <input type="email">\n    <button>内容を送信</button>\n  </form>', 'フォームの練習'),
    completionTests: [...common,
      { id: 'form', label: '同じformに名前・メール入力と送信ボタンを置く', kind: 'form' },
      { id: 'textInput', label: '名前欄に一意のid、対応label、name、requiredを付ける', kind: 'control', value: 'text' },
      { id: 'emailInput', label: 'メール欄に一意のid、対応label、異なるname、requiredを付ける', kind: 'control', value: 'email' }],
    hints: ['labelのforとinputのidを一致させます。開始タグにnameとrequiredも加えましょう。ボタンにもtype="submit"を書きます。'],
    explanation: 'ラベルと入力欄が対応し、入力の種類と必須条件を持つフォームになりました。第2章の学習を振り返りましょう。',
  },
].map((lesson, index, all) => ({ courseId: 'web-foundation', chapterId: 'html-chapter01', ...lesson, nextLessonId: all[index + 1]?.id ?? null }));
export const chapters = [
  { id: 'html-chapter01', title: 'HTML第1章', number: '01' },
  { id: 'html-chapter02', title: 'HTML第2章', number: '02' },
];
