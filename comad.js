//module comad

import "https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js";

/*
titleCall対応
*/
const re_titleCall=/^# (.+?)[\|｜](.+?)[\|｜](.+)/

function isTitleCall(d){
  return re_titleCall.test(d)
}
function titleCall(d){
  const ma = d.match(re_titleCall);
  const temp=`
<div class="title-call">
  <p class="left">${ma[1]}</p>
  <h1 class="center">${ma[2]}</h1>
  <p class="right">${ma[3]}</p>
</div>  
  `.trim();
  return temp;
}

/*
var x ="# ウィザードリィ３｜どうしようもない僕に天使が｜管理人：ウィズファン"

document.querySelector('.output')
 .innerHTML = titleCall(x)
*/

function comad(text,updateCaller){
  //updatecallerは呼び出すだけで何もしない。
  var o={}

  o.format =(text)=>{
    //markedの仕様では末尾は\nが入ったほうがいい。
    //空文字の場合は何もしない。基本入ってこない。
    if(!text) return '';
    return text.trimEnd() +'\n'
  }

  o.parse = (d)=>{
    //titleCall対応
    if(isTitleCall(d)){
      return titleCall(d)
    }
    return marked.parse(d)
  }

  o.view = document.createElement('div')
  {
    o.view.classList.add('view')    
  }
  o.edit = document.createElement('div')
  {
    o.edit.classList.add('edit')
    o.edit.contentEditable = 'plaintext-only'
    o.edit.style.outline ='none'
    o.edit.textContent = o.format(text) //text||''
  }

  o.comad = document.createElement('div')
  {
    o.comad.classList.add('comad')
    o.comad.append(o.view)
    o.comad.append(o.edit)
  }

  o.showView =()=>{
    o.edit.style.display ='none'
    o.view.style.display ='block'
    const text = o.format(o.edit.textContent) //
    o.view.innerHTML = o.parse(text)
    if(updateCaller){
      requestAnimationFrame(updateCaller) //.innerHTMLは即座に反映されない
    }
  }
  
  o.showEdit =()=>{
    o.edit.style.display ='block'
    o.view.style.display ='none'
    
    o.edit.focus()
  }

  ////
  o.view.onclick = o.showEdit
  o.edit.onblur = o.showView  
  o.showView();
  //showView,showEdit,el,parse,setText
  return o;
}

window.comad = comad;


//add comadInput
/*
loadData対応
*/

function comadInput(inputTarget,outputTarget,savekey,loadData){

  var $input = document.createElement('div')
  $input.id ="comadInput"
  //$input.style = `outline:1px solid;padding:1rem;border-radius:4px;`
  $input.contentEditable="plaintext-only"
  document.querySelector(inputTarget).append($input)
  //
  var $output = document.querySelector(outputTarget)
  //
  var key = savekey || '__comad__'
  //
  $input.onkeydown =(event)=>{
    if(event.key==='Enter'){
      event.preventDefault();

      const text = $input.textContent
      $input.textContent=''
      input(text)
    }
  }

  function input(text){
    const co = comad(text,update)

    $output.append(co.comad)  
  }

  function update(){return requestAnimationFrame(()=>{

    const datas = Array.from($output.querySelectorAll('.edit'))
    .map(d=>d.textContent).join('\n')
    localStorage.setItem(key,datas)

  })}

  /*
  function load(){
    var data = localStorage.getItem(key)||''
    input(data)
  }
  */
  
  function load(){
    var data = loadData||localStorage.getItem(key)||'' //ロードデータ対応
    var ary = prase(data)
    for(const line of ary){
      //await nextAnimationFrame();
      input(line)
    }    
  }

  /*
  async function load(){
    //アニメーションフレームごとに追加する。
    var data = localStorage.getItem(key)||''
    var ary = data.split('\n').filter(d=>d)
    for(const line of ary){
      await nextAnimationFrame();
      input(line)
    }
  }
  */
  
  load();///////////////////////////////

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


window.comadInput = comadInput

/*
//#comadInput{ outline:1px solid;padding:1rem;border-radius:4px;}
comadInput('footer','main','__comad__')
*/


