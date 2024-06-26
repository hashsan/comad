// chatGPT修正版。良くない場合はrollback
// module comad

import "https://cdn.jsdelivr.net/npm/marked/marked.min.js";

// marked
function custom_renderer() {
  // カスタムレンダラーの作成
  const renderer = new marked.Renderer();

  // 元の heading メソッドを保存
  const _heading = renderer.heading;

  const re_titleCall = /^(.+?)[\|｜](.+?)[\|｜](.+)/;

  function isTitleCall(d) {
    return re_titleCall.test(d);
  }

  function titleCall(d) {
    const ma = d.match(re_titleCall);
    const temp = `
<div class="title-call">
  <p class="left">${ma[1]}</p>
  <h1 class="center">${ma[2]}</h1>
  <p class="right">${ma[3]}</p>
</div>`.trim();
    return temp;
  }

  // heading メソッドをオーバーライド
  renderer.heading = function (text, level) {
    if (level === 1 && isTitleCall(text)) {
      // <h1> かつ 正規表現にマッチする場合にカスタム処理を実行
      return titleCall(text);
    }
    // その他の見出しは元の処理を実行
    return _heading.call(renderer, text, level);
  };


 //行頭＊は注釈。大文字の「＊」のみ。
 const _paragraph = renderer.paragraph;
    renderer.paragraph = function(text) {
      if (text.startsWith('＊')) {
        return `<p class="small">${text}</p>`;
      } else {
        return _paragraph.call(this, text);
      }
    };

  return renderer;
}

// marked.js のオプションにカスタムレンダラーを設定
marked.setOptions({
  renderer: custom_renderer(),
});

function comad(text, updateCaller, readonlyFlg) {
  // updateCallerは呼び出すだけで何もしない。
  var o = {};

  o.format = (text) => {
    // markedの仕様では末尾は\nが入ったほうがいい。
    // 空文字の場合は何もしない。基本入ってこない。
    if (!text) return '';
    return text.trimEnd() + '\n';
  };

  o.parse = marked.parse;

  o.view = document.createElement('div');
  o.view.classList.add('view');

  o.edit = document.createElement('div');
  o.edit.classList.add('edit');
  o.edit.contentEditable = 'plaintext-only';
  o.edit.style.outline = 'none';
  o.edit.textContent = o.format(text); // text||''

  o.comad = document.createElement('div');
  o.comad.classList.add('comad');
  o.comad.append(o.view);
  o.comad.append(o.edit);

  o.showView = () => {
    o.edit.style.display = 'none';
    o.view.style.display = 'block';
    const text = o.format(o.edit.textContent); //
    o.view.innerHTML = o.parse(text);
    if (typeof updateCaller === 'function') {
      requestAnimationFrame(updateCaller); // .innerHTMLは即座に反映されない
    }
  };

  o.showEdit = () => {
    o.edit.style.display = 'block';
    o.view.style.display = 'none';
    o.edit.focus();
  };

  o.readonly = (flg) => {
    flg = !!flg;
    o.view.onclick = flg ? null : o.showEdit;
    o.edit.onblur = flg ? null : o.showView;
    o.showView();
  };

  o.readonly(readonlyFlg);
  // showView, showEdit, el, parse, setText, readonly
  return o;
}

window.comad = comad;

// add comadInput
/*
loadData対応
*/

function comadInput(inputTarget, outputTarget, savekey, loadData) {
  var $input = document.createElement('div');
  $input.id = "comadInput";
  $input.contentEditable = "plaintext-only";
  document.querySelector(inputTarget).append($input);

  var $output = document.querySelector(outputTarget);

  var key = savekey || '__comad__';

  $input.onkeydown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const text = $input.textContent;
      $input.textContent = '';
      input(text);
    }
  };

  function input(text) {
    const co = comad(text, update);
    $output.append(co.comad);
  }

  function update() {
    return requestAnimationFrame(() => {
      const datas = Array.from($output.querySelectorAll('.edit'))
        .map(d => d.textContent).join('\n');
      localStorage.setItem(key, datas);
    });
  }

  function load() {
    var data = loadData || localStorage.getItem(key) || '';
    var ary = prase(data);
    for (const line of ary) {
      input(line);
    }
  }

  load(); ////////////////
}

function prase(text) {
  const lines = text.split('\n');
  const result = [];
  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('#')) {
      // ヘッダ行を見つけたら、現在のセクションを結果に追加し、新しいセクションを開始する
      if (currentSection !== '') {
        result.push(currentSection);
      }
      currentSection = line;
    } else {
      // 現在のセクションに行を追加する
      currentSection += '\n' + line;
    }
  }

  // 最後のセクションを結果に追加する
  if (currentSection !== '') {
    result.push(currentSection);
  }

  return result;
}

function nextAnimationFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
}

window.comadInput = comadInput;
