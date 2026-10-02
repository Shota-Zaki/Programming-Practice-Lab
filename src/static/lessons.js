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
const cssMarkup = '<main class="card"><h1>学習カード</h1><p class="intro">少しずつ学びます。</p><p id="note">今日の目標を決めましょう。</p></main><p class="plain">通常の段落です。</p>';
const cssTest = (id, label, selector, property, expected, requiredSelector) => ({ id, label, selector, property, expected, requiredSelector });
const sides = (property, value) => ['top','right','bottom','left'].map(side => cssTest(`${property}-${side}`, `${property}の${{top:'上',right:'右',bottom:'下',left:'左'}[side]}を${value}にする`, '.card', `${property}-${side}`, value));
const layoutMarkup = '<h1>学習メニュー</h1><div class="cards"><article class="tile"><h2>HTML</h2><p>構造を学ぶ</p></article><article class="tile"><h2>CSS</h2><p>見た目を整える</p></article><article class="tile"><h2>JavaScript</h2><p>動きを作る</p></article><article class="tile"><h2>復習</h2><p>繰り返し練習する</p></article></div>';
const responsiveWidths = [375,599,600,768,1280];
const combinedWidths = [375,599,600,768,899,900,1280];
const viewportTest = (id,label,selector,property,widths,valueForWidth) => ({id,label,selector,property,byWidth:Object.fromEntries(widths.map(width=>[width,valueForWidth(width)]))});
const layoutChecks = [cssTest('visible','すべてのカードを表示する','.cards','visible-items','true'),cssTest('equal','カードを等幅にする','.cards','equal-columns','true'),{id:'gap',label:'カードの縦横の間隔を16pxにする',checks:[cssTest('x','','.cards','column-gap','16px'),cssTest('y','','.cards','row-gap','16px')]}];
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
  {
    id: 'css01', language: 'css', chapterId: 'css-chapter03', title: '選択子で対象を選ぶ', markup: cssMarkup,
    objectives: ['要素・クラス・IDの選択子を区別する', '狙った要素だけに見た目を指定する'],
    contentBlocks: [
      { title: 'CSSの書き方', text: 'CSSは見た目を指定する言語です。選択子 { プロパティ: 値; } と書きます。h1は要素名、.introはclass="intro"、#noteはid="note"を選びます。pxは画面上の長さを指定する単位です。' },
      { title: '今回の入力', text: '下のHTMLは固定です。CSSだけを入力してh1を32px、.introを20px、#noteをfont-weight:700にしてください。通常の段落.plainは16pxのままにします。p全体を大きくすると指定していない段落にも影響します。' },
    ],
    example: 'h1 { font-size: 32px; }\n.intro { font-size: 20px; }\n#note { font-weight: 700; }',
    starterCode: 'h1 { }\n.intro { }\n#note { }',
    completionTests: [cssTest('heading-size','h1選択子で見出しを32pxにする','h1','font-size','32px','h1'), cssTest('intro-size','.intro選択子で紹介文を20pxにする','.intro','font-size','20px','.intro'), cssTest('note-weight','#note選択子で注記を太字700にする','#note','font-weight','700','#note'), cssTest('plain-size','通常の段落は16pxのままにする','.plain','font-size','16px')],
    hints: ['クラスには .、IDには # を付けます。値の後にセミコロンを書きましょう。'], explanation: '対象ごとに選択子を使い分けて指定できました。',
  },
  {
    id: 'css02', language: 'css', chapterId: 'css-chapter03', title: '色と文字を整える', markup: cssMarkup,
    objectives: ['文字色と背景色を区別する', '文字サイズと行の高さを指定する'],
    contentBlocks: [
      { title: '色を指定する', text: 'colorは文字色、background-colorは背景色です。#14532dのような16進数やrgb()で色を指定できます。.cardの文字色を#14532d、背景を#f0fdf4にしましょう。' },
      { title: '読みやすい文字', text: 'font-sizeは文字の大きさ、line-heightは行の高さです。.cardを18pxとline-height:1.5にすると、行の高さは27pxになります。単位なしの1.5は文字サイズに対する倍率で、子の段落にも引き継がれます。色だけで重要さを伝えず、文章も分かりやすくしましょう。' },
    ],
    example: '.card {\n  color: #14532d;\n  background-color: #f0fdf4;\n  font-size: 18px;\n  line-height: 1.5;\n}', starterCode: '.card {\n  /* 色と文字を指定しましょう */\n}',
    completionTests: [cssTest('color','カードの文字色を#14532dにする','.card','color','rgb(20, 83, 45)'),cssTest('background','背景色を#f0fdf4にする','.card','background-color','rgb(240, 253, 244)'),cssTest('font','文字サイズを18pxにする','.card','font-size','18px'),cssTest('line','行の高さを27px相当にする','.card','line-height','27px')],
    hints: ['colorとbackground-colorの役割を確認してください。line-height: 1.5にはpxを付けません。'], explanation: '文字色・背景色・文字サイズ・行の高さを指定できました。',
  },
  {
    id: 'css03', language: 'css', chapterId: 'css-chapter03', title: '内側と外側の余白', markup: cssMarkup,
    objectives: ['paddingとmarginの違いを理解する', '四辺と一辺の余白を指定する'],
    contentBlocks: [
      { title: '二種類の余白', text: 'paddingは内容と境界線の間の内側余白、marginは要素の外側の余白です。.cardにpadding:24pxとmargin:16pxを書きましょう。一つの値で四辺すべてに適用されます。' },
      { title: '一辺だけ指定する', text: 'margin-bottomは下側の余白です。.introに12pxを指定してください。paddingとmarginを逆にすると同じ見た目にはなりません。上下に隣り合うブロックのmarginは相殺されることもありますが、この演習では指定した四辺の値を確認します。' },
    ],
    example: '.card { padding: 24px; margin: 16px; }\n.intro { margin-bottom: 12px; }', starterCode: '.card { }\n.intro { }',
    completionTests: [{id:'padding',label:'カードの内側余白を四辺とも24pxにする',checks:sides('padding','24px')},{id:'margin',label:'カードの外側余白を四辺とも16pxにする',checks:sides('margin','16px')},cssTest('intro-margin','紹介文の下余白を12pxにする','.intro','margin-bottom','12px')],
    hints: ['上下左右を個別に指定しても構いません。paddingは内側、marginは外側です。'], explanation: '内側と外側の余白を区別して指定できました。',
  },
  {
    id: 'css04', language: 'css', chapterId: 'css-chapter03', title: 'ボックスモデルと幅', markup: cssMarkup,
    objectives: ['内容・余白・境界線の関係を理解する', 'border-boxで外寸を指定する'],
    contentBlocks: [
      { title: '幅に含まれるもの', text: '通常のcontent-boxではwidthは内容部分だけの幅です。paddingとborderを加えると外寸は大きくなります。box-sizing:border-boxでは、widthに内側余白と境界線を含めます。marginは含みません。' },
      { title: '240pxのカードを作る', text: '.cardをwidth:240px、padding:16px、border:2px solid #166534、box-sizing:border-boxにしてください。境界線を含む外寸は240px、内容部分は204pxです。content-boxのままだと外寸は276pxになります。' },
    ],
    example: '.card {\n  width: 240px;\n  padding: 16px;\n  border: 2px solid #166534;\n  box-sizing: border-box;\n}', starterCode: '.card {\n  width: 240px;\n}',
    completionTests: [cssTest('box','box-sizingをborder-boxにする','.card','box-sizing','border-box'),cssTest('width','widthを240pxにする','.card','width','240px'),{id:'padding',label:'内側余白を四辺とも16pxにする',checks:sides('padding','16px')},{id:'border',label:'四辺の境界線を2px・実線・#166534にする',checks:['top','right','bottom','left'].flatMap(side => [cssTest(`border-${side}`,`${{top:'上',right:'右',bottom:'下',left:'左'}[side]}の境界線幅を2pxにする`,'.card',`border-${side}-width`,'2px'),cssTest(`solid-${side}`,`${{top:'上',right:'右',bottom:'下',left:'左'}[side]}の境界線を実線にする`,'.card',`border-${side}-style`,'solid'),cssTest(`color-${side}`,`${{top:'上',right:'右',bottom:'下',left:'左'}[side]}の境界線色を#166534にする`,'.card',`border-${side}-color`,'rgb(22, 101, 52)')])},cssTest('outer','境界線を含む外寸を240pxにする','.card','outer-width','240')],
    hints: ['borderには太さ・種類・色を指定します。paddingを含めても外寸240pxになるようbox-sizingを確認しましょう。'], explanation: '第3章の基本ができました。次は配置と画面幅への対応を学びます。',
  },
  {
    id:'css05', language:'css', chapterId:'css-chapter04', title:'Flexboxで横に並べる',
    markup:'<h1>学習の順序</h1><div class="links"><span>HTML</span><span>CSS</span><span>JavaScript</span></div>',
    objectives:['親要素にFlexboxを指定する','並べる方向と揃え方を指定する'],
    contentBlocks:[
      {title:'親が子の並べ方を決める',text:'display:flexを親の.linksへ指定すると、直下の三つのspanが並びます。flex-direction:rowは横方向です。子のspanへflexを付けても、兄弟同士の並び方は変わりません。'},
      {title:'軸と間隔',text:'rowではjustify-contentが横方向、align-itemsが縦方向の揃え方です。space-betweenで両端と間に配置し、centerで縦位置を中央に揃えます。gap:16pxで項目間に最低16pxの間隔を設けてください。採点は800px幅で三つが横一列になるかも確認します。'},
    ],
    example:'.links { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 16px; }',
    starterCode:'.links {\n  /* 並べ方と間隔を指定しましょう */\n}',
    completionTests:[cssTest('flex','親.linksにdisplay:flexを指定する','.links','display','flex'),cssTest('direction','横方向rowにする','.links','flex-direction','row'),cssTest('align','縦位置を中央に揃える','.links','align-items','center'),cssTest('justify','横方向をspace-betweenにする','.links','justify-content','space-between'),cssTest('gap','項目の間隔を16pxにする','.links','column-gap','16px'),{id:'layout',label:'三つの項目を表示し、横一列に並べる',checks:[cssTest('rows','','.links','rows','1'),cssTest('columns','','.links','columns','3')]}],
    hints:['.linksが親、spanが子です。rowでは主軸が横になります。'],explanation:'親要素で子の並びと揃え方を指定できました。',
  },
  {
    id:'css06',language:'css',chapterId:'css-chapter04',title:'Gridで列を作る',markup:layoutMarkup,
    objectives:['Gridの行と列を理解する','等幅の二列を作る'],
    contentBlocks:[
      {title:'行と列をまとめて配置する',text:'Gridは縦横の配置を作る仕組みです。親.cardsにdisplay:gridを書き、grid-template-columns:repeat(2,1fr)で等幅二列を作ります。frは残りの空間を分ける単位で、1fr 1frと書いても同じです。'},
      {title:'四つのカードを並べる',text:'gap:16pxで縦横の間隔を揃えます。四つのカードは二列・二行になります。一つのカードだけ幅を変えず、列の幅をGridに任せましょう。'},
    ],
    example:'.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }',starterCode:'.cards { }',
    completionTests:[cssTest('grid','親.cardsにdisplay:gridを指定する','.cards','display','grid'),cssTest('columns','二列にする','.cards','columns','2'),cssTest('rows','二行にする','.cards','rows','2'),...layoutChecks],
    hints:['repeat(2, 1fr)は、同じ幅の列を二つ作る指定です。'],explanation:'四つのカードを等幅の二列に並べられました。',
  },
  {
    id:'css07',language:'css',chapterId:'css-chapter04',title:'画面幅で列数を変える',markup:layoutMarkup,viewports:responsiveWidths,
    objectives:['メディアクエリで画面幅に応じて切り替える','境界の前後を確認する'],
    contentBlocks:[
      {title:'狭い画面から始める',text:'最初に.cardsをGridの一列にします。@media (min-width:600px) { ... }の中に、二列にする規則を書きます。min-widthは指定した幅以上という意味なので、600pxちょうどでも二列になります。'},
      {title:'境界を確かめる',text:'375pxと599pxでは一列、600px・768px・1280pxでは二列にしてください。どの幅でもgap:16pxと等幅を維持し、カードを隠さず横にはみ出さないようにします。プレビュー幅を選ぶと、同じCSSを異なる幅で表示できます。'},
    ],
    example:'.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }\n@media (min-width: 600px) {\n  .cards { grid-template-columns: repeat(2, 1fr); }\n}',
    starterCode:'.cards { display: grid; gap: 16px; }\n/* 600px以上の規則を追加しましょう */',
    completionTests:[cssTest('grid','すべての幅でGridにする','.cards','display','grid'),viewportTest('columns','600px未満は一列、600px以上は二列にする','.cards','columns',responsiveWidths,w=>w<600?'1':'2'),...layoutChecks,cssTest('overflow','すべての採点幅で横にはみ出さない','.cards','no-overflow','true')],
    hints:['@mediaの内側と外側の波括弧を確認しましょう。条件内の規則は後に書くと同じ選択子を上書きできます。'],explanation:'境界の前後で列数が切り替わるようになりました。',
  },
  {
    id:'css08',language:'css',chapterId:'css-chapter04',title:'レスポンシブな学習ページ',
    markup:'<main class="page"><header class="page-head"><h1>学習メニュー</h1><p>自分のペースで進めよう</p></header>'+layoutMarkup.slice(layoutMarkup.indexOf('<div'))+'</main>',viewports:combinedWidths,
    objectives:['FlexboxとGridを組み合わせる','二つの境界とページの最大幅を指定する'],
    contentBlocks:[
      {title:'全体と部分を組み合わせる',text:'ページ.pageはmax-width:960px、padding:16px、box-sizing:border-boxにします。max-widthは幅の上限なので、狭い画面では画面に収まります。margin:0 autoを加えると広い画面で中央に配置できます。'},
      {title:'二つの境界',text:'見出し部分.page-headをFlexboxにし、600px未満はcolumn、600px以上はrowにします。カードはGridで一列、600px以上で二列、900px以上で三列にします。両方の親にgap:16pxを指定してください。599/600pxと899/900pxの前後を確認し、全カードを等幅で表示しましょう。'},
    ],
    example:'.page { max-width: 960px; margin: 0 auto; padding: 16px; box-sizing: border-box; }\n.page-head { display: flex; flex-direction: column; gap: 16px; }\n.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }\n@media (min-width: 600px) {\n  .page-head { flex-direction: row; }\n  .cards { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 900px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}',
    starterCode:'.page { }\n.page-head { }\n.cards { }',
    completionTests:[{id:'page',label:'ページの最大幅960px・内側余白16px・border-boxを指定する',checks:[cssTest('max','','.page','max-width','960px'),cssTest('box','','.page','box-sizing','border-box'),...sides('padding','16px').map(c=>({...c,selector:'.page'}))]},cssTest('flex','見出し部分をFlexboxにする','.page-head','display','flex'),viewportTest('direction','見出し部分は600px未満で縦、それ以上で横に並べる','.page-head','flex-direction',combinedWidths,w=>w<600?'column':'row'),cssTest('head-gap','見出し部分の間隔を16pxにする','.page-head','gap','16px'),cssTest('grid','カードをGridにする','.cards','display','grid'),viewportTest('columns','600px・900pxを境にカードを一列・二列・三列にする','.cards','columns',combinedWidths,w=>w<600?'1':w<900?'2':'3'),...layoutChecks,cssTest('overflow','すべての採点幅でページが横にはみ出さない','.page','no-overflow','true')],
    hints:['小さい画面の規則を先に書き、大きい画面の@mediaを後へ並べます。width:960pxではなくmax-width:960pxです。'],explanation:'第4章が完了しました。画面幅に合わせた配置を組み合わせられました。',
  },
  {
    id:'js01',language:'javascript',chapterId:'js-chapter05',title:'変数と値を使う',parameters:['quantity'],returnExpression:'total',
    objectives:['constとletで値に名前を付ける','数値の式で結果を計算する'],
    contentBlocks:[
      {title:'値に名前を付ける',text:'const unitPrice = 100; は数値100にunitPriceという名前を付けます。constの変数へ別の値は代入できません。letは後から値を変える変数に使います。文字列は引用符で囲み、数値は囲みません。'},
      {title:'提供される個数から計算する',text:'この演習ではquantity（個数）が環境から渡されます。quantityを宣言し直さず、単価100と掛けてtotalへ数値を入れてください。個数3なら300、1なら100、0なら0です。値を表示するだけでなく、totalへ計算結果を入れることが課題です。'},
    ],
    example:'const unitPrice = 100;\nlet total = unitPrice * quantity;',starterCode:'const unitPrice = 100;\nlet total = 0;\n// quantityを使ってtotalを計算しましょう',
    completionTests:[{id:'three',label:'個数3から数値300を計算する',inputs:[3],expected:300},{id:'one',label:'個数1から数値100を計算する',inputs:[1],expected:100},{id:'zero',label:'個数0から数値0を計算する',inputs:[0],expected:0}],
    hints:['掛け算は * です。quantityは用意されています。「300」は文字列なので、数値300とは区別します。'],explanation:'値に名前を付け、個数に応じた数値を計算できました。',
  },
  {
    id:'js02',language:'javascript',chapterId:'js-chapter05',title:'条件と繰り返しで集計する',parameters:['scores'],returnExpression:'total',
    objectives:['条件に一致する値を選ぶ','for...ofで配列を繰り返し処理する'],
    contentBlocks:[
      {title:'条件によって処理を選ぶ',text:'if (score >= 60) はscoreが60以上のときだけ内側を実行します。>=は60ちょうどを含み、>では含みません。配列scoresは演習環境から渡される点数の並びです。'},
      {title:'合計を更新する',text:'let total = 0; から始め、for (const score of scores)で各点数を取り出します。条件に一致するときだけtotal += scoreで加算してください。[40,60,80]なら140、空の配列なら0、[60]なら60、[59]なら0です。繰り返しはWorker内で実行され、長く続く処理は停止できます。'},
    ],
    example:'let total = 0;\nfor (const score of scores) {\n  if (score >= 60) {\n    total += score;\n  }\n}',starterCode:'let total = 0;\n// scoresの60以上の点数だけを合計しましょう',
    completionTests:[{id:'mixed',label:'40・60・80から140を合計する',inputs:[[40,60,80]],expected:140},{id:'empty',label:'空の配列から0を返す',inputs:[[]],expected:0},{id:'boundary',label:'60ちょうどを含める',inputs:[[60]],expected:60},{id:'below',label:'59を合計へ含めない',inputs:[[59]],expected:0}],
    hints:['totalの初期値は0です。>=で境界を含め、加算する場所がifの内側か確かめてください。'],explanation:'条件の境界を含め、配列を集計できました。',
  },
  {
    id:'js03',language:'javascript',chapterId:'js-chapter05',title:'関数の引数と戻り値',parameters:['price','rate'],returnExpression:'priceAfterTax(price, rate)',
    objectives:['関数へ引数を渡す','returnで計算結果を返す'],
    contentBlocks:[
      {title:'処理に名前を付ける',text:'function priceAfterTax(price, rate) { ... } は価格と税率を受け取る関数です。関数内では引数のpriceとrateを使い、同じ処理を異なる値で繰り返し利用できます。'},
      {title:'結果を呼び出し元へ返す',text:'return price + price * rate; で税込価格を返します。価格100・税率0.1なら110、価格200・税率0なら200、価格0なら0です。console.logは戻り値ではありません。priceAfterTaxという関数名と二つの引数を維持してください。計算の小さな浮動小数点誤差は採点で許容します。'},
    ],
    example:'function priceAfterTax(price, rate) {\n  return price + price * rate;\n}',starterCode:'function priceAfterTax(price, rate) {\n  // 計算結果をreturnで返しましょう\n}',
    completionTests:[{id:'tax',label:'価格100・税率0.1から110を返す',inputs:[100,0.1],expected:110},{id:'no-tax',label:'価格200・税率0から200を返す',inputs:[200,0],expected:200},{id:'zero',label:'価格0から0を返す',inputs:[0,0.1],expected:0}],
    hints:['console.logではなくreturnを使います。呼び出し例はpriceAfterTax(100, 0.1)です。'],explanation:'第5章が完了しました。引数を受け取り、結果を返す関数を作れました。',
  },
  {
    id:'js04',language:'javascript',executionMode:'dom',chapterId:'js-chapter06',title:'DOMの文字を更新する',
    objectives:['IDで要素を取得する','textContentで画面の文字を更新する'],
    contentBlocks:[
      {title:'HTMLの要素をJavaScriptから選ぶ',text:'DOMはHTMLの要素をプログラムから扱うための仕組みです。document.querySelector("#heading")はIDがheadingの要素を取得します。#はIDの選択子です。対象がないとnullになるため、用意されたHTMLのIDと一致させましょう。'},
      {title:'表示する文字を更新する',text:'取得した要素のtextContentへ文字列を代入すると、その要素の文字が変わります。#headingを「学習メモ」、#messageを「DOMの文字を更新できました」へ変更してください。textContentはHTMLタグのような文字列も文字として扱い、HTMLを作りません。HTMLは環境が用意するため、入力欄にはJavaScriptだけを書きます。'},
      {title:'この演習で使えるAPI',text:'この環境ではWorkerと隔離した画面の間で、教材指定のIDへのquerySelectorとtextContent/valueを扱う限定ブリッジを使います。通常のブラウザーDOM全体ではありません。ID以外の選択子、innerHTML、createElement、style、親画面やブラウザー保存は使えません。文字列・数値・booleanの書込みは文字列化され160 UTF-16単位まで、null/undefined/オブジェクトは拒否します。画面の結果は実行後に確認します。この教材ではtextContentの文字列更新だけを扱います。'},
    ],
    fixture:{markup:'<h1 id="heading">はじめの見出し</h1><p id="message">ここへ学習メモを表示します</p>',selectors:['#heading','#message'],steps:[]},
    example:'const heading = document.querySelector("#heading");\nconst message = document.querySelector("#message");\nheading.textContent = "学習メモ";\nmessage.textContent = "DOMの文字を更新できました";',
    starterCode:'const heading = document.querySelector("#heading");\nconst message = document.querySelector("#message");\n// 二つの要素のtextContentを更新しましょう',
    completionTests:[{id:'heading-text',label:'見出しを「学習メモ」に更新する',step:0,selector:'#heading',property:'textContent',expected:'学習メモ'},{id:'message-text',label:'本文を「DOMの文字を更新できました」に更新する',step:0,selector:'#message',property:'textContent',expected:'DOMの文字を更新できました'}],
    hints:['heading.textContent = "学習メモ"; の形で代入します。ID、変数名、引用符と表示する文字を確認してください。'],explanation:'要素をIDで選び、textContentで文字を更新できました。第6章の残り2教材は準備中です。',
  },
].map((lesson, index, all) => ({ language: 'html', courseId: 'web-foundation', chapterId: 'html-chapter01', ...lesson, nextLessonId: all[index + 1]?.id ?? null }));
export const chapters = [
  { id: 'html-chapter01', title: 'HTML第1章', number: '01' },
  { id: 'html-chapter02', title: 'HTML第2章', number: '02' },
  { id: 'css-chapter03', title: 'CSS第3章', number: '03', language: 'CSS' },
  { id: 'css-chapter04', title: 'CSS第4章', number: '04', language: 'CSS' },
  { id: 'js-chapter05', title: 'JavaScript第5章', number: '05', language: 'JAVASCRIPT' },
  { id: 'js-chapter06', title: 'JavaScript第6章', number: '06', language: 'JAVASCRIPT', plannedLessons:3 },
];
