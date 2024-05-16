# comad
toggle editor

```
import "https://hashsan.github.io/comad/comad.js";

var co = comad('# xyz',()=>{ console.log('update') })

document.body.append(co.comad);// co.comad is element

```

## comadInput(inputTarget,outputTarget,savekey:localStorage key)
```
import "https://hashsan.github.io/comad/comad.js";

comadInput('footer','main','__test__')
```
```
#comadInput{
  outline:1px solid;padding:1rem;border-radius:4px;  
}
```
```
.comad
 .view
 .edit
```
