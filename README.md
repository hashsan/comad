# comad
toggle editor

```
import "https://hashsan.github.io/comad/comad.js";

var text='# xyz'
var c = comad(text,()=>{
   console.log('update')
})
document.body.append(c.comad);

```
```
function comadDatas(){
  return Array.from(document.querySelectorAll('.comad .edit'))
   .map(d=>d.textContent).join('\n')
}
```
```
.comad
 .view
 .edit
```
