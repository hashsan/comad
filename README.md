# comad
toggle editor

https://hashsan.github.io/comad/dragonback.html

```
import "https://hashsan.github.io/comad/comad.js";

var co = comad('# xyz',()=>{ console.log('updated') })

document.body.append(co.comad);// co.comad is element

```

## comadInput(inputTarget,outputTarget,savekey:localStorage key)
保存したテキストデータは、ローカルストレージに保存されているので、サーバにあげる場合は、このデータを取得する。

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

```
/*@font-face*/
/* FantasticCreatures.ttf のフォントフェイス */
@font-face {
  font-family: 'FantasticCreatures';
  src: url('https://hashsan.github.io/comad/FantasticCreatures.ttf') format('truetype');
}

/* AncientModernTales.ttf のフォントフェイス */
@font-face {
  font-family: 'AncientModernTales';
  src: url('https://hashsan.github.io/comad/AncientModernTales.ttf') format('truetype');
}

/* dragonlord.otf のフォントフェイス */
@font-face {
  font-family: 'Dragonlord';
  src: url('https://hashsan.github.io/comad/dragonlord.otf') format('opentype');
}

```

