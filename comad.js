//module comad

import "https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js";

function comad(text,updateCaller){
  //updatecallerは呼び出すだけで何もしない。
  var o={}

  o.format =(text)=>{
    //markedの仕様では末尾は\nが入ったほうがいい。
    //空文字の場合は何もしない。基本入ってこない。
    if(!text) return '';
    return text.trimEnd() +'\n'
  }

  o.parse = marked.parse

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

function comadInput(inputTarget,outputTarget,savekey){

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

  function load(){
    var data = localStorage.getItem(key)||''
    input(data)
  }

  load();

}

window.comadInput = comadInput

/*
//#comadInput{ outline:1px solid;padding:1rem;border-radius:4px;}
comadInput('footer','main','__comad__')
*/


