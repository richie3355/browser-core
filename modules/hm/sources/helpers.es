// Warning, there should not be any imports here, otherwise it might break
// convert-index-2.es and index-worker.js

export function ngrams(s, n = 2, skip_hash = true) {
  const grams = [];
  for (const t of s.split(' ')) {
    for (let i = 0; i < len(t) - n + 1; ++i) {
      let charbeg = '';
      let charend = '';
      if (i === 0) {
        charbeg = '#';
      }

      if (i + n >= len(t)) {
        charend = '#';
      }

      if (skip_hash) {
        grams.push(t.slice(i, i + n));
      }
      else {
        grams.push(charbeg + t.slice(i, i + n) + charend);
      }

      if (charend === '#') {
        break;
      }
    }
  }
  return grams;
}

export function len(obj) {
  if (typeof obj === 'string' || Array.isArray(obj)) {
        // Object.keys(obj) might be !== obj.length for arrays
    return obj.length;
  }
  if (typeof obj === 'object') {
    return Object.keys(obj).length;
  }
  throw 'cannot tell length of ' + (typeof obj);
}

export function comp_url(url) {
  let dom, p1, p2, qs;
  if (url.startsWith('file://')) {
    dom = url.replace('file://', '');
    p1 = null;
    p2 = null;
    qs = null;
  }
  else {
    const u1 = url.replace('http://', '').replace('https://', '');
    const vu1 = u1.split('?');
    const path = vu1[0];
    qs = (len(vu1) > 1 ? vu1.slice(1).join('?') : null);

    const vp = path.split('/');

    dom = vp[0];

    if (len(vp) > 3) {
      p1 = vp.slice(1, 3).join('/');
      p2 = vp.slice(3).join('/');
    }
    else if (len(vp) > 1) {
      p1 = vp.slice(1).join('/');
      p2 = null;
    }
        else {
      p1 = null;
      p2 = null;
    }

    const vdom = dom.split('.');
    if (vdom[0] === 'www' && len(vdom) > 1) {
      dom = vdom.slice(1).join('.');
    }
  }
  return [dom, p1, p2, qs];
}

export function is_search_url(url) {
    // taken from CliqzHumanWeb.jsm # checkIfSearchURL()
    // but modified to allow for empty queries, note the * instead of +,
  const re_requery = /\.google\..*?[#?&;]q=[^$&]*/; //
  const re_yrequery = /.search.yahoo\..*?[#?&;]p=[^$&]*/; // regex for yahoo query
  const re_brequery = /\.bing\..*?[#?&;]q=[^$&]*/; // regex for yahoo query

  if (re_requery.test(url) || re_yrequery.test(url) || re_brequery.test(url)) { // and re_reref.search(url) is None:
    const _mat = /.*[?&#]q=([^&]*)/.exec(url);
    if (_mat) {
      let query = decodeURIComponent(_mat[1]).replace(/\+/g, ' ');
      if (query) {
        query = query.replace(/\s+/g, ' ').trim();
        return [true, query];
      }
    }
    return [true, null];
  }
  return [false, null];
}

export class QueryNorm {
  constructor() {
    const punctuation = '!"\'()*,-./:;?[\\]^_`{|}~%$=&+#';
    this.regex = new RegExp('[' + punctuation + ']', 'g');
    this.regex2 = new RegExp(' +', 'g');
    const base64map = 'eyLDgSI6IkEiLCLEgiI6IkEiLCLhuq4iOiJBIiwi4bq2IjoiQSIsIuG6sCI6IkEiLCLhurIiOiJBIiwi4bq0IjoiQSIsIseNIjoiQSIsIsOCIjoiQSIsIuG6pCI6IkEiLCLhuqwiOiJBIiwi4bqmIjoiQSIsIuG6qCI6IkEiLCLhuqoiOiJBIiwiw4QiOiJBIiwix54iOiJBIiwiyKYiOiJBIiwix6AiOiJBIiwi4bqgIjoiQSIsIsiAIjoiQSIsIsOAIjoiQSIsIuG6oiI6IkEiLCLIgiI6IkEiLCLEgCI6IkEiLCLEhCI6IkEiLCLDhSI6IkEiLCLHuiI6IkEiLCLhuIAiOiJBIiwiyLoiOiJBIiwiw4MiOiJBIiwi6pyyIjoiQUEiLCLDhiI6IkFFIiwix7wiOiJBRSIsIseiIjoiQUUiLCLqnLQiOiJBTyIsIuqctiI6IkFVIiwi6py4IjoiQVYiLCLqnLoiOiJBViIsIuqcvCI6IkFZIiwi4biCIjoiQiIsIuG4hCI6IkIiLCLGgSI6IkIiLCLhuIYiOiJCIiwiyYMiOiJCIiwixoIiOiJCIiwixIYiOiJDIiwixIwiOiJDIiwiw4ciOiJDIiwi4biIIjoiQyIsIsSIIjoiQyIsIsSKIjoiQyIsIsaHIjoiQyIsIsi7IjoiQyIsIsSOIjoiRCIsIuG4kCI6IkQiLCLhuJIiOiJEIiwi4biKIjoiRCIsIuG4jCI6IkQiLCLGiiI6IkQiLCLhuI4iOiJEIiwix7IiOiJEIiwix4UiOiJEIiwixJAiOiJEIiwixosiOiJEIiwix7EiOiJEWiIsIseEIjoiRFoiLCLDiSI6IkUiLCLElCI6IkUiLCLEmiI6IkUiLCLIqCI6IkUiLCLhuJwiOiJFIiwiw4oiOiJFIiwi4bq+IjoiRSIsIuG7hiI6IkUiLCLhu4AiOiJFIiwi4buCIjoiRSIsIuG7hCI6IkUiLCLhuJgiOiJFIiwiw4siOiJFIiwixJYiOiJFIiwi4bq4IjoiRSIsIsiEIjoiRSIsIsOIIjoiRSIsIuG6uiI6IkUiLCLIhiI6IkUiLCLEkiI6IkUiLCLhuJYiOiJFIiwi4biUIjoiRSIsIsSYIjoiRSIsIsmGIjoiRSIsIuG6vCI6IkUiLCLhuJoiOiJFIiwi6p2qIjoiRVQiLCLhuJ4iOiJGIiwixpEiOiJGIiwix7QiOiJHIiwixJ4iOiJHIiwix6YiOiJHIiwixKIiOiJHIiwixJwiOiJHIiwixKAiOiJHIiwixpMiOiJHIiwi4bigIjoiRyIsIsekIjoiRyIsIuG4qiI6IkgiLCLIniI6IkgiLCLhuKgiOiJIIiwixKQiOiJIIiwi4rGnIjoiSCIsIuG4piI6IkgiLCLhuKIiOiJIIiwi4bikIjoiSCIsIsSmIjoiSCIsIsONIjoiSSIsIsSsIjoiSSIsIsePIjoiSSIsIsOOIjoiSSIsIsOPIjoiSSIsIuG4riI6IkkiLCLEsCI6IkkiLCLhu4oiOiJJIiwiyIgiOiJJIiwiw4wiOiJJIiwi4buIIjoiSSIsIsiKIjoiSSIsIsSqIjoiSSIsIsSuIjoiSSIsIsaXIjoiSSIsIsSoIjoiSSIsIuG4rCI6IkkiLCLqnbkiOiJEIiwi6p27IjoiRiIsIuqdvSI6IkciLCLqnoIiOiJSIiwi6p6EIjoiUyIsIuqehiI6IlQiLCLqnawiOiJJUyIsIsS0IjoiSiIsIsmIIjoiSiIsIuG4sCI6IksiLCLHqCI6IksiLCLEtiI6IksiLCLisakiOiJLIiwi6p2CIjoiSyIsIuG4siI6IksiLCLGmCI6IksiLCLhuLQiOiJLIiwi6p2AIjoiSyIsIuqdhCI6IksiLCLEuSI6IkwiLCLIvSI6IkwiLCLEvSI6IkwiLCLEuyI6IkwiLCLhuLwiOiJMIiwi4bi2IjoiTCIsIuG4uCI6IkwiLCLisaAiOiJMIiwi6p2IIjoiTCIsIuG4uiI6IkwiLCLEvyI6IkwiLCLisaIiOiJMIiwix4giOiJMIiwixYEiOiJMIiwix4ciOiJMSiIsIuG4viI6Ik0iLCLhuYAiOiJNIiwi4bmCIjoiTSIsIuKxriI6Ik0iLCLFgyI6Ik4iLCLFhyI6Ik4iLCLFhSI6Ik4iLCLhuYoiOiJOIiwi4bmEIjoiTiIsIuG5hiI6Ik4iLCLHuCI6Ik4iLCLGnSI6Ik4iLCLhuYgiOiJOIiwiyKAiOiJOIiwix4siOiJOIiwiw5EiOiJOIiwix4oiOiJOSiIsIsOTIjoiTyIsIsWOIjoiTyIsIseRIjoiTyIsIsOUIjoiTyIsIuG7kCI6Ik8iLCLhu5giOiJPIiwi4buSIjoiTyIsIuG7lCI6Ik8iLCLhu5YiOiJPIiwiw5YiOiJPIiwiyKoiOiJPIiwiyK4iOiJPIiwiyLAiOiJPIiwi4buMIjoiTyIsIsWQIjoiTyIsIsiMIjoiTyIsIsOSIjoiTyIsIuG7jiI6Ik8iLCLGoCI6Ik8iLCLhu5oiOiJPIiwi4buiIjoiTyIsIuG7nCI6Ik8iLCLhu54iOiJPIiwi4bugIjoiTyIsIsiOIjoiTyIsIuqdiiI6Ik8iLCLqnYwiOiJPIiwixYwiOiJPIiwi4bmSIjoiTyIsIuG5kCI6Ik8iLCLGnyI6Ik8iLCLHqiI6Ik8iLCLHrCI6Ik8iLCLDmCI6Ik8iLCLHviI6Ik8iLCLDlSI6Ik8iLCLhuYwiOiJPIiwi4bmOIjoiTyIsIsisIjoiTyIsIsaiIjoiT0kiLCLqnY4iOiJPTyIsIsaQIjoiRSIsIsaGIjoiTyIsIsiiIjoiT1UiLCLhuZQiOiJQIiwi4bmWIjoiUCIsIuqdkiI6IlAiLCLGpCI6IlAiLCLqnZQiOiJQIiwi4rGjIjoiUCIsIuqdkCI6IlAiLCLqnZgiOiJRIiwi6p2WIjoiUSIsIsWUIjoiUiIsIsWYIjoiUiIsIsWWIjoiUiIsIuG5mCI6IlIiLCLhuZoiOiJSIiwi4bmcIjoiUiIsIsiQIjoiUiIsIsiSIjoiUiIsIuG5niI6IlIiLCLJjCI6IlIiLCLisaQiOiJSIiwi6py+IjoiQyIsIsaOIjoiRSIsIsWaIjoiUyIsIuG5pCI6IlMiLCLFoCI6IlMiLCLhuaYiOiJTIiwixZ4iOiJTIiwixZwiOiJTIiwiyJgiOiJTIiwi4bmgIjoiUyIsIuG5oiI6IlMiLCLhuagiOiJTIiwixaQiOiJUIiwixaIiOiJUIiwi4bmwIjoiVCIsIsiaIjoiVCIsIsi+IjoiVCIsIuG5qiI6IlQiLCLhuawiOiJUIiwixqwiOiJUIiwi4bmuIjoiVCIsIsauIjoiVCIsIsWmIjoiVCIsIuKxryI6IkEiLCLqnoAiOiJMIiwixpwiOiJNIiwiyYUiOiJWIiwi6pyoIjoiVFoiLCLDmiI6IlUiLCLFrCI6IlUiLCLHkyI6IlUiLCLDmyI6IlUiLCLhubYiOiJVIiwiw5wiOiJVIiwix5ciOiJVIiwix5kiOiJVIiwix5siOiJVIiwix5UiOiJVIiwi4bmyIjoiVSIsIuG7pCI6IlUiLCLFsCI6IlUiLCLIlCI6IlUiLCLDmSI6IlUiLCLhu6YiOiJVIiwixq8iOiJVIiwi4buoIjoiVSIsIuG7sCI6IlUiLCLhu6oiOiJVIiwi4busIjoiVSIsIuG7riI6IlUiLCLIliI6IlUiLCLFqiI6IlUiLCLhuboiOiJVIiwixbIiOiJVIiwixa4iOiJVIiwixagiOiJVIiwi4bm4IjoiVSIsIuG5tCI6IlUiLCLqnZ4iOiJWIiwi4bm+IjoiViIsIsayIjoiViIsIuG5vCI6IlYiLCLqnaAiOiJWWSIsIuG6giI6IlciLCLFtCI6IlciLCLhuoQiOiJXIiwi4bqGIjoiVyIsIuG6iCI6IlciLCLhuoAiOiJXIiwi4rGyIjoiVyIsIuG6jCI6IlgiLCLhuooiOiJYIiwiw50iOiJZIiwixbYiOiJZIiwixbgiOiJZIiwi4bqOIjoiWSIsIuG7tCI6IlkiLCLhu7IiOiJZIiwixrMiOiJZIiwi4bu2IjoiWSIsIuG7viI6IlkiLCLIsiI6IlkiLCLJjiI6IlkiLCLhu7giOiJZIiwixbkiOiJaIiwixb0iOiJaIiwi4bqQIjoiWiIsIuKxqyI6IloiLCLFuyI6IloiLCLhupIiOiJaIiwiyKQiOiJaIiwi4bqUIjoiWiIsIsa1IjoiWiIsIsSyIjoiSUoiLCLFkiI6Ik9FIiwi4bSAIjoiQSIsIuG0gSI6IkFFIiwiypkiOiJCIiwi4bSDIjoiQiIsIuG0hCI6IkMiLCLhtIUiOiJEIiwi4bSHIjoiRSIsIuqcsCI6IkYiLCLJoiI6IkciLCLKmyI6IkciLCLKnCI6IkgiLCLJqiI6IkkiLCLKgSI6IlIiLCLhtIoiOiJKIiwi4bSLIjoiSyIsIsqfIjoiTCIsIuG0jCI6IkwiLCLhtI0iOiJNIiwiybQiOiJOIiwi4bSPIjoiTyIsIsm2IjoiT0UiLCLhtJAiOiJPIiwi4bSVIjoiT1UiLCLhtJgiOiJQIiwiyoAiOiJSIiwi4bSOIjoiTiIsIuG0mSI6IlIiLCLqnLEiOiJTIiwi4bSbIjoiVCIsIuKxuyI6IkUiLCLhtJoiOiJSIiwi4bScIjoiVSIsIuG0oCI6IlYiLCLhtKEiOiJXIiwiyo8iOiJZIiwi4bSiIjoiWiIsIsOhIjoiYSIsIsSDIjoiYSIsIuG6ryI6ImEiLCLhurciOiJhIiwi4bqxIjoiYSIsIuG6syI6ImEiLCLhurUiOiJhIiwix44iOiJhIiwiw6IiOiJhIiwi4bqlIjoiYSIsIuG6rSI6ImEiLCLhuqciOiJhIiwi4bqpIjoiYSIsIuG6qyI6ImEiLCLDpCI6ImEiLCLHnyI6ImEiLCLIpyI6ImEiLCLHoSI6ImEiLCLhuqEiOiJhIiwiyIEiOiJhIiwiw6AiOiJhIiwi4bqjIjoiYSIsIsiDIjoiYSIsIsSBIjoiYSIsIsSFIjoiYSIsIuG2jyI6ImEiLCLhupoiOiJhIiwiw6UiOiJhIiwix7siOiJhIiwi4biBIjoiYSIsIuKxpSI6ImEiLCLDoyI6ImEiLCLqnLMiOiJhYSIsIsOmIjoiYWUiLCLHvSI6ImFlIiwix6MiOiJhZSIsIuqctSI6ImFvIiwi6py3IjoiYXUiLCLqnLkiOiJhdiIsIuqcuyI6ImF2Iiwi6py9IjoiYXkiLCLhuIMiOiJiIiwi4biFIjoiYiIsIsmTIjoiYiIsIuG4hyI6ImIiLCLhtawiOiJiIiwi4baAIjoiYiIsIsaAIjoiYiIsIsaDIjoiYiIsIsm1IjoibyIsIsSHIjoiYyIsIsSNIjoiYyIsIsOnIjoiYyIsIuG4iSI6ImMiLCLEiSI6ImMiLCLJlSI6ImMiLCLEiyI6ImMiLCLGiCI6ImMiLCLIvCI6ImMiLCLEjyI6ImQiLCLhuJEiOiJkIiwi4biTIjoiZCIsIsihIjoiZCIsIuG4iyI6ImQiLCLhuI0iOiJkIiwiyZciOiJkIiwi4baRIjoiZCIsIuG4jyI6ImQiLCLhta0iOiJkIiwi4baBIjoiZCIsIsSRIjoiZCIsIsmWIjoiZCIsIsaMIjoiZCIsIsSxIjoiaSIsIsi3IjoiaiIsIsmfIjoiaiIsIsqEIjoiaiIsIsezIjoiZHoiLCLHhiI6ImR6Iiwiw6kiOiJlIiwixJUiOiJlIiwixJsiOiJlIiwiyKkiOiJlIiwi4bidIjoiZSIsIsOqIjoiZSIsIuG6vyI6ImUiLCLhu4ciOiJlIiwi4buBIjoiZSIsIuG7gyI6ImUiLCLhu4UiOiJlIiwi4biZIjoiZSIsIsOrIjoiZSIsIsSXIjoiZSIsIuG6uSI6ImUiLCLIhSI6ImUiLCLDqCI6ImUiLCLhursiOiJlIiwiyIciOiJlIiwixJMiOiJlIiwi4biXIjoiZSIsIuG4lSI6ImUiLCLisbgiOiJlIiwixJkiOiJlIiwi4baSIjoiZSIsIsmHIjoiZSIsIuG6vSI6ImUiLCLhuJsiOiJlIiwi6p2rIjoiZXQiLCLhuJ8iOiJmIiwixpIiOiJmIiwi4bWuIjoiZiIsIuG2giI6ImYiLCLHtSI6ImciLCLEnyI6ImciLCLHpyI6ImciLCLEoyI6ImciLCLEnSI6ImciLCLEoSI6ImciLCLJoCI6ImciLCLhuKEiOiJnIiwi4baDIjoiZyIsIselIjoiZyIsIuG4qyI6ImgiLCLInyI6ImgiLCLhuKkiOiJoIiwixKUiOiJoIiwi4rGoIjoiaCIsIuG4pyI6ImgiLCLhuKMiOiJoIiwi4bilIjoiaCIsIsmmIjoiaCIsIuG6liI6ImgiLCLEpyI6ImgiLCLGlSI6Imh2Iiwiw60iOiJpIiwixK0iOiJpIiwix5AiOiJpIiwiw64iOiJpIiwiw68iOiJpIiwi4bivIjoiaSIsIuG7iyI6ImkiLCLIiSI6ImkiLCLDrCI6ImkiLCLhu4kiOiJpIiwiyIsiOiJpIiwixKsiOiJpIiwixK8iOiJpIiwi4baWIjoiaSIsIsmoIjoiaSIsIsSpIjoiaSIsIuG4rSI6ImkiLCLqnboiOiJkIiwi6p28IjoiZiIsIuG1uSI6ImciLCLqnoMiOiJyIiwi6p6FIjoicyIsIuqehyI6InQiLCLqna0iOiJpcyIsIsewIjoiaiIsIsS1IjoiaiIsIsqdIjoiaiIsIsmJIjoiaiIsIuG4sSI6ImsiLCLHqSI6ImsiLCLEtyI6ImsiLCLisaoiOiJrIiwi6p2DIjoiayIsIuG4syI6ImsiLCLGmSI6ImsiLCLhuLUiOiJrIiwi4baEIjoiayIsIuqdgSI6ImsiLCLqnYUiOiJrIiwixLoiOiJsIiwixpoiOiJsIiwiyawiOiJsIiwixL4iOiJsIiwixLwiOiJsIiwi4bi9IjoibCIsIsi0IjoibCIsIuG4tyI6ImwiLCLhuLkiOiJsIiwi4rGhIjoibCIsIuqdiSI6ImwiLCLhuLsiOiJsIiwixYAiOiJsIiwiyasiOiJsIiwi4baFIjoibCIsIsmtIjoibCIsIsWCIjoibCIsIseJIjoibGoiLCLFvyI6InMiLCLhupwiOiJzIiwi4bqbIjoicyIsIuG6nSI6InMiLCLhuL8iOiJtIiwi4bmBIjoibSIsIuG5gyI6Im0iLCLJsSI6Im0iLCLhta8iOiJtIiwi4baGIjoibSIsIsWEIjoibiIsIsWIIjoibiIsIsWGIjoibiIsIuG5iyI6Im4iLCLItSI6Im4iLCLhuYUiOiJuIiwi4bmHIjoibiIsIse5IjoibiIsIsmyIjoibiIsIuG5iSI6Im4iLCLGniI6Im4iLCLhtbAiOiJuIiwi4baHIjoibiIsIsmzIjoibiIsIsOxIjoibiIsIseMIjoibmoiLCLDsyI6Im8iLCLFjyI6Im8iLCLHkiI6Im8iLCLDtCI6Im8iLCLhu5EiOiJvIiwi4buZIjoibyIsIuG7kyI6Im8iLCLhu5UiOiJvIiwi4buXIjoibyIsIsO2IjoibyIsIsirIjoibyIsIsivIjoibyIsIsixIjoibyIsIuG7jSI6Im8iLCLFkSI6Im8iLCLIjSI6Im8iLCLDsiI6Im8iLCLhu48iOiJvIiwixqEiOiJvIiwi4bubIjoibyIsIuG7oyI6Im8iLCLhu50iOiJvIiwi4bufIjoibyIsIuG7oSI6Im8iLCLIjyI6Im8iLCLqnYsiOiJvIiwi6p2NIjoibyIsIuKxuiI6Im8iLCLFjSI6Im8iLCLhuZMiOiJvIiwi4bmRIjoibyIsIserIjoibyIsIsetIjoibyIsIsO4IjoibyIsIse/IjoibyIsIsO1IjoibyIsIuG5jSI6Im8iLCLhuY8iOiJvIiwiyK0iOiJvIiwixqMiOiJvaSIsIuqdjyI6Im9vIiwiyZsiOiJlIiwi4baTIjoiZSIsIsmUIjoibyIsIuG2lyI6Im8iLCLIoyI6Im91Iiwi4bmVIjoicCIsIuG5lyI6InAiLCLqnZMiOiJwIiwixqUiOiJwIiwi4bWxIjoicCIsIuG2iCI6InAiLCLqnZUiOiJwIiwi4bW9IjoicCIsIuqdkSI6InAiLCLqnZkiOiJxIiwiyqAiOiJxIiwiyYsiOiJxIiwi6p2XIjoicSIsIsWVIjoiciIsIsWZIjoiciIsIsWXIjoiciIsIuG5mSI6InIiLCLhuZsiOiJyIiwi4bmdIjoiciIsIsiRIjoiciIsIsm+IjoiciIsIuG1syI6InIiLCLIkyI6InIiLCLhuZ8iOiJyIiwiybwiOiJyIiwi4bWyIjoiciIsIuG2iSI6InIiLCLJjSI6InIiLCLJvSI6InIiLCLihoQiOiJjIiwi6py/IjoiYyIsIsmYIjoiZSIsIsm/IjoiciIsIsWbIjoicyIsIuG5pSI6InMiLCLFoSI6InMiLCLhuaciOiJzIiwixZ8iOiJzIiwixZ0iOiJzIiwiyJkiOiJzIiwi4bmhIjoicyIsIuG5oyI6InMiLCLhuakiOiJzIiwiyoIiOiJzIiwi4bW0IjoicyIsIuG2iiI6InMiLCLIvyI6InMiLCLJoSI6ImciLCLhtJEiOiJvIiwi4bSTIjoibyIsIuG0nSI6InUiLCLFpSI6InQiLCLFoyI6InQiLCLhubEiOiJ0IiwiyJsiOiJ0IiwiyLYiOiJ0Iiwi4bqXIjoidCIsIuKxpiI6InQiLCLhuasiOiJ0Iiwi4bmtIjoidCIsIsatIjoidCIsIuG5ryI6InQiLCLhtbUiOiJ0IiwixqsiOiJ0IiwiyogiOiJ0IiwixaciOiJ0Iiwi4bW6IjoidGgiLCLJkCI6ImEiLCLhtIIiOiJhZSIsIsedIjoiZSIsIuG1tyI6ImciLCLJpSI6ImgiLCLKriI6ImgiLCLKryI6ImgiLCLhtIkiOiJpIiwiyp4iOiJrIiwi6p6BIjoibCIsIsmvIjoibSIsIsmwIjoibSIsIuG0lCI6Im9lIiwiybkiOiJyIiwiybsiOiJyIiwiyboiOiJyIiwi4rG5IjoiciIsIsqHIjoidCIsIsqMIjoidiIsIsqNIjoidyIsIsqOIjoieSIsIuqcqSI6InR6Iiwiw7oiOiJ1Iiwixa0iOiJ1Iiwix5QiOiJ1Iiwiw7siOiJ1Iiwi4bm3IjoidSIsIsO8IjoidSIsIseYIjoidSIsIseaIjoidSIsIsecIjoidSIsIseWIjoidSIsIuG5syI6InUiLCLhu6UiOiJ1IiwixbEiOiJ1IiwiyJUiOiJ1Iiwiw7kiOiJ1Iiwi4bunIjoidSIsIsawIjoidSIsIuG7qSI6InUiLCLhu7EiOiJ1Iiwi4burIjoidSIsIuG7rSI6InUiLCLhu68iOiJ1IiwiyJciOiJ1IiwixasiOiJ1Iiwi4bm7IjoidSIsIsWzIjoidSIsIuG2mSI6InUiLCLFryI6InUiLCLFqSI6InUiLCLhubkiOiJ1Iiwi4bm1IjoidSIsIuG1qyI6InVlIiwi6p24IjoidW0iLCLisbQiOiJ2Iiwi6p2fIjoidiIsIuG5vyI6InYiLCLKiyI6InYiLCLhtowiOiJ2Iiwi4rGxIjoidiIsIuG5vSI6InYiLCLqnaEiOiJ2eSIsIuG6gyI6InciLCLFtSI6InciLCLhuoUiOiJ3Iiwi4bqHIjoidyIsIuG6iSI6InciLCLhuoEiOiJ3Iiwi4rGzIjoidyIsIuG6mCI6InciLCLhuo0iOiJ4Iiwi4bqLIjoieCIsIuG2jSI6IngiLCLDvSI6InkiLCLFtyI6InkiLCLDvyI6InkiLCLhuo8iOiJ5Iiwi4bu1IjoieSIsIuG7syI6InkiLCLGtCI6InkiLCLhu7ciOiJ5Iiwi4bu/IjoieSIsIsizIjoieSIsIuG6mSI6InkiLCLJjyI6InkiLCLhu7kiOiJ5IiwixboiOiJ6Iiwixb4iOiJ6Iiwi4bqRIjoieiIsIsqRIjoieiIsIuKxrCI6InoiLCLFvCI6InoiLCLhupMiOiJ6IiwiyKUiOiJ6Iiwi4bqVIjoieiIsIuG1tiI6InoiLCLhto4iOiJ6IiwiypAiOiJ6IiwixrYiOiJ6IiwiyYAiOiJ6Iiwi76yAIjoiZmYiLCLvrIMiOiJmZmkiLCLvrIQiOiJmZmwiLCLvrIEiOiJmaSIsIu+sgiI6ImZsIiwixLMiOiJpaiIsIsWTIjoib2UiLCLvrIYiOiJzdCIsIuKCkCI6ImEiLCLigpEiOiJlIiwi4bWiIjoiaSIsIuKxvCI6ImoiLCLigpIiOiJvIiwi4bWjIjoiciIsIuG1pCI6InUiLCLhtaUiOiJ2Iiwi4oKTIjoieCJ9';
    this.latin_map = JSON.parse(decodeURIComponent(escape(atob(base64map))));
  }

  normalize(s) {
    s = s.toLowerCase();
    if (s.indexOf('%') != -1) s = decodeURIComponent(s);
    s = s.replace(this.regex, ' ');
    s = s.replace(this.regex2, ' ');
    s = s.trim();
    s = s.split(' ').filter(t => {
      return len(t) > 0;
    }).join(' ');

        // this is a hack, this is not accessible within the contect of the function in replace
        //
    const loc_latin_map = this.latin_map;
    s = s.replace(/[^A-Za-z0-9\[\] ]/g, function (a) { return loc_latin_map[a] || a; });

    return s;
  }
  static no_bow_normalizer() {
    const qn = new QueryNorm();
    return qn;
  }
}

export function normalize(s) {
  const REGEX = /[!\"\'\(\)\*,-\.\/:;\?\[\\\]\^_`\{\|\}~%\$=&\+#]/g;
  const REGEX2 = / +/g;
  const LATIN_MAP_ENC = 'eyLDgSI6IkEiLCLEgiI6IkEiLCLhuq4iOiJBIiwi4bq2IjoiQSIsIuG6sCI6IkEiLCLhurIiOiJBIiwi4bq0IjoiQSIsIseNIjoiQSIsIsOCIjoiQSIsIuG6pCI6IkEiLCLhuqwiOiJBIiwi4bqmIjoiQSIsIuG6qCI6IkEiLCLhuqoiOiJBIiwiw4QiOiJBRSIsIseeIjoiQSIsIsimIjoiQSIsIsegIjoiQSIsIuG6oCI6IkEiLCLIgCI6IkEiLCLDgCI6IkEiLCLhuqIiOiJBIiwiyIIiOiJBIiwixIAiOiJBIiwixIQiOiJBIiwiw4UiOiJBIiwix7oiOiJBIiwi4biAIjoiQSIsIsi6IjoiQSIsIsODIjoiQSIsIuqcsiI6IkFBIiwiw4YiOiJBRSIsIse8IjoiQUUiLCLHoiI6IkFFIiwi6py0IjoiQU8iLCLqnLYiOiJBVSIsIuqcuCI6IkFWIiwi6py6IjoiQVYiLCLqnLwiOiJBWSIsIuG4giI6IkIiLCLhuIQiOiJCIiwixoEiOiJCIiwi4biGIjoiQiIsIsmDIjoiQiIsIsaCIjoiQiIsIsSGIjoiQyIsIsSMIjoiQyIsIsOHIjoiQyIsIuG4iCI6IkMiLCLEiCI6IkMiLCLEiiI6IkMiLCLGhyI6IkMiLCLIuyI6IkMiLCLEjiI6IkQiLCLhuJAiOiJEIiwi4biSIjoiRCIsIuG4iiI6IkQiLCLhuIwiOiJEIiwixooiOiJEIiwi4biOIjoiRCIsIseyIjoiRCIsIseFIjoiRCIsIsSQIjoiRCIsIsaLIjoiRCIsIsexIjoiRFoiLCLHhCI6IkRaIiwiw4kiOiJFIiwixJQiOiJFIiwixJoiOiJFIiwiyKgiOiJFIiwi4bicIjoiRSIsIsOKIjoiRSIsIuG6viI6IkUiLCLhu4YiOiJFIiwi4buAIjoiRSIsIuG7giI6IkUiLCLhu4QiOiJFIiwi4biYIjoiRSIsIsOLIjoiRSIsIsSWIjoiRSIsIuG6uCI6IkUiLCLIhCI6IkUiLCLDiCI6IkUiLCLhuroiOiJFIiwiyIYiOiJFIiwixJIiOiJFIiwi4biWIjoiRSIsIuG4lCI6IkUiLCLEmCI6IkUiLCLJhiI6IkUiLCLhurwiOiJFIiwi4biaIjoiRSIsIuqdqiI6IkVUIiwi4bieIjoiRiIsIsaRIjoiRiIsIse0IjoiRyIsIsSeIjoiRyIsIsemIjoiRyIsIsSiIjoiRyIsIsScIjoiRyIsIsSgIjoiRyIsIsaTIjoiRyIsIuG4oCI6IkciLCLHpCI6IkciLCLhuKoiOiJIIiwiyJ4iOiJIIiwi4bioIjoiSCIsIsSkIjoiSCIsIuKxpyI6IkgiLCLhuKYiOiJIIiwi4biiIjoiSCIsIuG4pCI6IkgiLCLEpiI6IkgiLCLDjSI6IkkiLCLErCI6IkkiLCLHjyI6IkkiLCLDjiI6IkkiLCLDjyI6IkkiLCLhuK4iOiJJIiwixLAiOiJJIiwi4buKIjoiSSIsIsiIIjoiSSIsIsOMIjoiSSIsIuG7iCI6IkkiLCLIiiI6IkkiLCLEqiI6IkkiLCLEriI6IkkiLCLGlyI6IkkiLCLEqCI6IkkiLCLhuKwiOiJJIiwi6p25IjoiRCIsIuqduyI6IkYiLCLqnb0iOiJHIiwi6p6CIjoiUiIsIuqehCI6IlMiLCLqnoYiOiJUIiwi6p2sIjoiSVMiLCLEtCI6IkoiLCLJiCI6IkoiLCLhuLAiOiJLIiwix6giOiJLIiwixLYiOiJLIiwi4rGpIjoiSyIsIuqdgiI6IksiLCLhuLIiOiJLIiwixpgiOiJLIiwi4bi0IjoiSyIsIuqdgCI6IksiLCLqnYQiOiJLIiwixLkiOiJMIiwiyL0iOiJMIiwixL0iOiJMIiwixLsiOiJMIiwi4bi8IjoiTCIsIuG4tiI6IkwiLCLhuLgiOiJMIiwi4rGgIjoiTCIsIuqdiCI6IkwiLCLhuLoiOiJMIiwixL8iOiJMIiwi4rGiIjoiTCIsIseIIjoiTCIsIsWBIjoiTCIsIseHIjoiTEoiLCLhuL4iOiJNIiwi4bmAIjoiTSIsIuG5giI6Ik0iLCLisa4iOiJNIiwixYMiOiJOIiwixYciOiJOIiwixYUiOiJOIiwi4bmKIjoiTiIsIuG5hCI6Ik4iLCLhuYYiOiJOIiwix7giOiJOIiwixp0iOiJOIiwi4bmIIjoiTiIsIsigIjoiTiIsIseLIjoiTiIsIsORIjoiTiIsIseKIjoiTkoiLCLDkyI6Ik8iLCLFjiI6Ik8iLCLHkSI6Ik8iLCLDlCI6Ik8iLCLhu5AiOiJPIiwi4buYIjoiTyIsIuG7kiI6Ik8iLCLhu5QiOiJPIiwi4buWIjoiTyIsIsOWIjoiT0UiLCLIqiI6Ik8iLCLIriI6Ik8iLCLIsCI6Ik8iLCLhu4wiOiJPIiwixZAiOiJPIiwiyIwiOiJPIiwiw5IiOiJPIiwi4buOIjoiTyIsIsagIjoiTyIsIuG7miI6Ik8iLCLhu6IiOiJPIiwi4bucIjoiTyIsIuG7niI6Ik8iLCLhu6AiOiJPIiwiyI4iOiJPIiwi6p2KIjoiTyIsIuqdjCI6Ik8iLCLFjCI6Ik8iLCLhuZIiOiJPIiwi4bmQIjoiTyIsIsafIjoiTyIsIseqIjoiTyIsIsesIjoiTyIsIsOYIjoiTyIsIse+IjoiTyIsIsOVIjoiTyIsIuG5jCI6Ik8iLCLhuY4iOiJPIiwiyKwiOiJPIiwixqIiOiJPSSIsIuqdjiI6Ik9PIiwixpAiOiJFIiwixoYiOiJPIiwiyKIiOiJPVSIsIuG5lCI6IlAiLCLhuZYiOiJQIiwi6p2SIjoiUCIsIsakIjoiUCIsIuqdlCI6IlAiLCLisaMiOiJQIiwi6p2QIjoiUCIsIuqdmCI6IlEiLCLqnZYiOiJRIiwixZQiOiJSIiwixZgiOiJSIiwixZYiOiJSIiwi4bmYIjoiUiIsIuG5miI6IlIiLCLhuZwiOiJSIiwiyJAiOiJSIiwiyJIiOiJSIiwi4bmeIjoiUiIsIsmMIjoiUiIsIuKxpCI6IlIiLCLqnL4iOiJDIiwixo4iOiJFIiwixZoiOiJTIiwi4bmkIjoiUyIsIsWgIjoiUyIsIuG5piI6IlMiLCLFniI6IlMiLCLFnCI6IlMiLCLImCI6IlMiLCLhuaAiOiJTIiwi4bmiIjoiUyIsIuG5qCI6IlMiLCLFpCI6IlQiLCLFoiI6IlQiLCLhubAiOiJUIiwiyJoiOiJUIiwiyL4iOiJUIiwi4bmqIjoiVCIsIuG5rCI6IlQiLCLGrCI6IlQiLCLhua4iOiJUIiwixq4iOiJUIiwixaYiOiJUIiwi4rGvIjoiQSIsIuqegCI6IkwiLCLGnCI6Ik0iLCLJhSI6IlYiLCLqnKgiOiJUWiIsIsOaIjoiVSIsIsWsIjoiVSIsIseTIjoiVSIsIsObIjoiVSIsIuG5tiI6IlUiLCLDnCI6IlVFIiwix5ciOiJVIiwix5kiOiJVIiwix5siOiJVIiwix5UiOiJVIiwi4bmyIjoiVSIsIuG7pCI6IlUiLCLFsCI6IlUiLCLIlCI6IlUiLCLDmSI6IlUiLCLhu6YiOiJVIiwixq8iOiJVIiwi4buoIjoiVSIsIuG7sCI6IlUiLCLhu6oiOiJVIiwi4busIjoiVSIsIuG7riI6IlUiLCLIliI6IlUiLCLFqiI6IlUiLCLhuboiOiJVIiwixbIiOiJVIiwixa4iOiJVIiwixagiOiJVIiwi4bm4IjoiVSIsIuG5tCI6IlUiLCLqnZ4iOiJWIiwi4bm+IjoiViIsIsayIjoiViIsIuG5vCI6IlYiLCLqnaAiOiJWWSIsIuG6giI6IlciLCLFtCI6IlciLCLhuoQiOiJXIiwi4bqGIjoiVyIsIuG6iCI6IlciLCLhuoAiOiJXIiwi4rGyIjoiVyIsIuG6jCI6IlgiLCLhuooiOiJYIiwiw50iOiJZIiwixbYiOiJZIiwixbgiOiJZIiwi4bqOIjoiWSIsIuG7tCI6IlkiLCLhu7IiOiJZIiwixrMiOiJZIiwi4bu2IjoiWSIsIuG7viI6IlkiLCLIsiI6IlkiLCLJjiI6IlkiLCLhu7giOiJZIiwixbkiOiJaIiwixb0iOiJaIiwi4bqQIjoiWiIsIuKxqyI6IloiLCLFuyI6IloiLCLhupIiOiJaIiwiyKQiOiJaIiwi4bqUIjoiWiIsIsa1IjoiWiIsIsSyIjoiSUoiLCLFkiI6Ik9FIiwi4bSAIjoiQSIsIuG0gSI6IkFFIiwiypkiOiJCIiwi4bSDIjoiQiIsIuG0hCI6IkMiLCLhtIUiOiJEIiwi4bSHIjoiRSIsIuqcsCI6IkYiLCLJoiI6IkciLCLKmyI6IkciLCLKnCI6IkgiLCLJqiI6IkkiLCLKgSI6IlIiLCLhtIoiOiJKIiwi4bSLIjoiSyIsIsqfIjoiTCIsIuG0jCI6IkwiLCLhtI0iOiJNIiwiybQiOiJOIiwi4bSPIjoiTyIsIsm2IjoiT0UiLCLhtJAiOiJPIiwi4bSVIjoiT1UiLCLhtJgiOiJQIiwiyoAiOiJSIiwi4bSOIjoiTiIsIuG0mSI6IlIiLCLqnLEiOiJTIiwi4bSbIjoiVCIsIuKxuyI6IkUiLCLhtJoiOiJSIiwi4bScIjoiVSIsIuG0oCI6IlYiLCLhtKEiOiJXIiwiyo8iOiJZIiwi4bSiIjoiWiIsIsOhIjoiYSIsIsSDIjoiYSIsIuG6ryI6ImEiLCLhurciOiJhIiwi4bqxIjoiYSIsIuG6syI6ImEiLCLhurUiOiJhIiwix44iOiJhIiwiw6IiOiJhIiwi4bqlIjoiYSIsIuG6rSI6ImEiLCLhuqciOiJhIiwi4bqpIjoiYSIsIuG6qyI6ImEiLCLDpCI6ImFlIiwix58iOiJhIiwiyKciOiJhIiwix6EiOiJhIiwi4bqhIjoiYSIsIsiBIjoiYSIsIsOgIjoiYSIsIuG6oyI6ImEiLCLIgyI6ImEiLCLEgSI6ImEiLCLEhSI6ImEiLCLhto8iOiJhIiwi4bqaIjoiYSIsIsOlIjoiYSIsIse7IjoiYSIsIuG4gSI6ImEiLCLisaUiOiJhIiwiw6MiOiJhIiwi6pyzIjoiYWEiLCLDpiI6ImFlIiwix70iOiJhZSIsIsejIjoiYWUiLCLqnLUiOiJhbyIsIuqctyI6ImF1Iiwi6py5IjoiYXYiLCLqnLsiOiJhdiIsIuqcvSI6ImF5Iiwi4biDIjoiYiIsIuG4hSI6ImIiLCLJkyI6ImIiLCLhuIciOiJiIiwi4bWsIjoiYiIsIuG2gCI6ImIiLCLGgCI6ImIiLCLGgyI6ImIiLCLJtSI6Im8iLCLEhyI6ImMiLCLEjSI6ImMiLCLDpyI6ImMiLCLhuIkiOiJjIiwixIkiOiJjIiwiyZUiOiJjIiwixIsiOiJjIiwixogiOiJjIiwiyLwiOiJjIiwixI8iOiJkIiwi4biRIjoiZCIsIuG4kyI6ImQiLCLIoSI6ImQiLCLhuIsiOiJkIiwi4biNIjoiZCIsIsmXIjoiZCIsIuG2kSI6ImQiLCLhuI8iOiJkIiwi4bWtIjoiZCIsIuG2gSI6ImQiLCLEkSI6ImQiLCLJliI6ImQiLCLGjCI6ImQiLCLEsSI6ImkiLCLItyI6ImoiLCLJnyI6ImoiLCLKhCI6ImoiLCLHsyI6ImR6Iiwix4YiOiJkeiIsIsOpIjoiZSIsIsSVIjoiZSIsIsSbIjoiZSIsIsipIjoiZSIsIuG4nSI6ImUiLCLDqiI6ImUiLCLhur8iOiJlIiwi4buHIjoiZSIsIuG7gSI6ImUiLCLhu4MiOiJlIiwi4buFIjoiZSIsIuG4mSI6ImUiLCLDqyI6ImUiLCLElyI6ImUiLCLhurkiOiJlIiwiyIUiOiJlIiwiw6giOiJlIiwi4bq7IjoiZSIsIsiHIjoiZSIsIsSTIjoiZSIsIuG4lyI6ImUiLCLhuJUiOiJlIiwi4rG4IjoiZSIsIsSZIjoiZSIsIuG2kiI6ImUiLCLJhyI6ImUiLCLhur0iOiJlIiwi4bibIjoiZSIsIuqdqyI6ImV0Iiwi4bifIjoiZiIsIsaSIjoiZiIsIuG1riI6ImYiLCLhtoIiOiJmIiwix7UiOiJnIiwixJ8iOiJnIiwix6ciOiJnIiwixKMiOiJnIiwixJ0iOiJnIiwixKEiOiJnIiwiyaAiOiJnIiwi4bihIjoiZyIsIuG2gyI6ImciLCLHpSI6ImciLCLhuKsiOiJoIiwiyJ8iOiJoIiwi4bipIjoiaCIsIsSlIjoiaCIsIuKxqCI6ImgiLCLhuKciOiJoIiwi4bijIjoiaCIsIuG4pSI6ImgiLCLJpiI6ImgiLCLhupYiOiJoIiwixKciOiJoIiwixpUiOiJodiIsIsOtIjoiaSIsIsStIjoiaSIsIseQIjoiaSIsIsOuIjoiaSIsIsOvIjoiaSIsIuG4ryI6ImkiLCLhu4siOiJpIiwiyIkiOiJpIiwiw6wiOiJpIiwi4buJIjoiaSIsIsiLIjoiaSIsIsSrIjoiaSIsIsSvIjoiaSIsIuG2liI6ImkiLCLJqCI6ImkiLCLEqSI6ImkiLCLhuK0iOiJpIiwi6p26IjoiZCIsIuqdvCI6ImYiLCLhtbkiOiJnIiwi6p6DIjoiciIsIuqehSI6InMiLCLqnociOiJ0Iiwi6p2tIjoiaXMiLCLHsCI6ImoiLCLEtSI6ImoiLCLKnSI6ImoiLCLJiSI6ImoiLCLhuLEiOiJrIiwix6kiOiJrIiwixLciOiJrIiwi4rGqIjoiayIsIuqdgyI6ImsiLCLhuLMiOiJrIiwixpkiOiJrIiwi4bi1IjoiayIsIuG2hCI6ImsiLCLqnYEiOiJrIiwi6p2FIjoiayIsIsS6IjoibCIsIsaaIjoibCIsIsmsIjoibCIsIsS+IjoibCIsIsS8IjoibCIsIuG4vSI6ImwiLCLItCI6ImwiLCLhuLciOiJsIiwi4bi5IjoibCIsIuKxoSI6ImwiLCLqnYkiOiJsIiwi4bi7IjoibCIsIsWAIjoibCIsIsmrIjoibCIsIuG2hSI6ImwiLCLJrSI6ImwiLCLFgiI6ImwiLCLHiSI6ImxqIiwixb8iOiJzIiwi4bqcIjoicyIsIuG6myI6InMiLCLhup0iOiJzIiwi4bi/IjoibSIsIuG5gSI6Im0iLCLhuYMiOiJtIiwiybEiOiJtIiwi4bWvIjoibSIsIuG2hiI6Im0iLCLFhCI6Im4iLCLFiCI6Im4iLCLFhiI6Im4iLCLhuYsiOiJuIiwiyLUiOiJuIiwi4bmFIjoibiIsIuG5hyI6Im4iLCLHuSI6Im4iLCLJsiI6Im4iLCLhuYkiOiJuIiwixp4iOiJuIiwi4bWwIjoibiIsIuG2hyI6Im4iLCLJsyI6Im4iLCLDsSI6Im4iLCLHjCI6Im5qIiwiw7MiOiJvIiwixY8iOiJvIiwix5IiOiJvIiwiw7QiOiJvIiwi4buRIjoibyIsIuG7mSI6Im8iLCLhu5MiOiJvIiwi4buVIjoibyIsIuG7lyI6Im8iLCLDtiI6Im9lIiwiyKsiOiJvIiwiyK8iOiJvIiwiyLEiOiJvIiwi4buNIjoibyIsIsWRIjoibyIsIsiNIjoibyIsIsOyIjoibyIsIuG7jyI6Im8iLCLGoSI6Im8iLCLhu5siOiJvIiwi4bujIjoibyIsIuG7nSI6Im8iLCLhu58iOiJvIiwi4buhIjoibyIsIsiPIjoibyIsIuqdiyI6Im8iLCLqnY0iOiJvIiwi4rG6IjoibyIsIsWNIjoibyIsIuG5kyI6Im8iLCLhuZEiOiJvIiwix6siOiJvIiwix60iOiJvIiwiw7giOiJvIiwix78iOiJvIiwiw7UiOiJvIiwi4bmNIjoibyIsIuG5jyI6Im8iLCLIrSI6Im8iLCLGoyI6Im9pIiwi6p2PIjoib28iLCLJmyI6ImUiLCLhtpMiOiJlIiwiyZQiOiJvIiwi4baXIjoibyIsIsijIjoib3UiLCLhuZUiOiJwIiwi4bmXIjoicCIsIuqdkyI6InAiLCLGpSI6InAiLCLhtbEiOiJwIiwi4baIIjoicCIsIuqdlSI6InAiLCLhtb0iOiJwIiwi6p2RIjoicCIsIuqdmSI6InEiLCLKoCI6InEiLCLJiyI6InEiLCLqnZciOiJxIiwixZUiOiJyIiwixZkiOiJyIiwixZciOiJyIiwi4bmZIjoiciIsIuG5myI6InIiLCLhuZ0iOiJyIiwiyJEiOiJyIiwiyb4iOiJyIiwi4bWzIjoiciIsIsiTIjoiciIsIuG5nyI6InIiLCLJvCI6InIiLCLhtbIiOiJyIiwi4baJIjoiciIsIsmNIjoiciIsIsm9IjoiciIsIuKGhCI6ImMiLCLqnL8iOiJjIiwiyZgiOiJlIiwiyb8iOiJyIiwixZsiOiJzIiwi4bmlIjoicyIsIsWhIjoicyIsIuG5pyI6InMiLCLFnyI6InMiLCLFnSI6InMiLCLImSI6InMiLCLhuaEiOiJzIiwi4bmjIjoicyIsIuG5qSI6InMiLCLKgiI6InMiLCLhtbQiOiJzIiwi4baKIjoicyIsIsi/IjoicyIsIsmhIjoiZyIsIuG0kSI6Im8iLCLhtJMiOiJvIiwi4bSdIjoidSIsIsWlIjoidCIsIsWjIjoidCIsIuG5sSI6InQiLCLImyI6InQiLCLItiI6InQiLCLhupciOiJ0Iiwi4rGmIjoidCIsIuG5qyI6InQiLCLhua0iOiJ0Iiwixq0iOiJ0Iiwi4bmvIjoidCIsIuG1tSI6InQiLCLGqyI6InQiLCLKiCI6InQiLCLFpyI6InQiLCLhtboiOiJ0aCIsIsmQIjoiYSIsIuG0giI6ImFlIiwix50iOiJlIiwi4bW3IjoiZyIsIsmlIjoiaCIsIsquIjoiaCIsIsqvIjoiaCIsIuG0iSI6ImkiLCLKniI6ImsiLCLqnoEiOiJsIiwiya8iOiJtIiwiybAiOiJtIiwi4bSUIjoib2UiLCLJuSI6InIiLCLJuyI6InIiLCLJuiI6InIiLCLisbkiOiJyIiwiyociOiJ0IiwiyowiOiJ2Iiwiyo0iOiJ3Iiwiyo4iOiJ5Iiwi6pypIjoidHoiLCLDuiI6InUiLCLFrSI6InUiLCLHlCI6InUiLCLDuyI6InUiLCLhubciOiJ1Iiwiw7wiOiJ1ZSIsIseYIjoidSIsIseaIjoidSIsIsecIjoidSIsIseWIjoidSIsIuG5syI6InUiLCLhu6UiOiJ1IiwixbEiOiJ1IiwiyJUiOiJ1Iiwiw7kiOiJ1Iiwi4bunIjoidSIsIsawIjoidSIsIuG7qSI6InUiLCLhu7EiOiJ1Iiwi4burIjoidSIsIuG7rSI6InUiLCLhu68iOiJ1IiwiyJciOiJ1IiwixasiOiJ1Iiwi4bm7IjoidSIsIsWzIjoidSIsIuG2mSI6InUiLCLFryI6InUiLCLFqSI6InUiLCLhubkiOiJ1Iiwi4bm1IjoidSIsIuG1qyI6InVlIiwi6p24IjoidW0iLCLisbQiOiJ2Iiwi6p2fIjoidiIsIuG5vyI6InYiLCLKiyI6InYiLCLhtowiOiJ2Iiwi4rGxIjoidiIsIuG5vSI6InYiLCLqnaEiOiJ2eSIsIuG6gyI6InciLCLFtSI6InciLCLhuoUiOiJ3Iiwi4bqHIjoidyIsIuG6iSI6InciLCLhuoEiOiJ3Iiwi4rGzIjoidyIsIuG6mCI6InciLCLhuo0iOiJ4Iiwi4bqLIjoieCIsIuG2jSI6IngiLCLDvSI6InkiLCLFtyI6InkiLCLDvyI6InkiLCLhuo8iOiJ5Iiwi4bu1IjoieSIsIuG7syI6InkiLCLGtCI6InkiLCLhu7ciOiJ5Iiwi4bu/IjoieSIsIsizIjoieSIsIuG6mSI6InkiLCLJjyI6InkiLCLhu7kiOiJ5IiwixboiOiJ6Iiwixb4iOiJ6Iiwi4bqRIjoieiIsIsqRIjoieiIsIuKxrCI6InoiLCLFvCI6InoiLCLhupMiOiJ6IiwiyKUiOiJ6Iiwi4bqVIjoieiIsIuG1tiI6InoiLCLhto4iOiJ6IiwiypAiOiJ6IiwixrYiOiJ6IiwiyYAiOiJ6Iiwi76yAIjoiZmYiLCLvrIMiOiJmZmkiLCLvrIQiOiJmZmwiLCLvrIEiOiJmaSIsIu+sgiI6ImZsIiwixLMiOiJpaiIsIsWTIjoib2UiLCLvrIYiOiJzdCIsIuKCkCI6ImEiLCLigpEiOiJlIiwi4bWiIjoiaSIsIuKxvCI6ImoiLCLigpIiOiJvIiwi4bWjIjoiciIsIuG1pCI6InUiLCLhtaUiOiJ2Iiwi4oKTIjoieCJ9';
  if (!normalize.LATIN_MAP) {
    normalize.LATIN_MAP = JSON.parse(atob_safe(LATIN_MAP_ENC));
  }
  s = s.toLowerCase();
  if (s.includes('%')) {
    try {
      s = decodeURIComponent(s);
    } catch (e) {}
  }
  const LATIN_MAP = normalize.LATIN_MAP;
  return s.replace(REGEX, ' ').replace(REGEX2, ' ').trim().replace(/[^A-Za-z0-9\[\] ]/g, a => LATIN_MAP[a] || a);
}

// TODO: test sth like http://foo.comunications.com/lalala/asdfasdg#foo
export function url_norm(u) {
  u = u.replace(/^http:\/\//, '');
  u = u.replace(/^https:\/\//, '');
  u = u.replace(/^www\./, '');

  const vu = u.split('/');
  const vdomain = vu[0].split('.');
  if (vdomain[vdomain.length - 1].length < 4) {
        // Replacing all occurrences of .com?
    u = u.replace(new RegExp('\\.' + vdomain[vdomain.length - 1], 'g'), '');
  }
  if (u.length > 0) {
    if (u[u.length - 1] === '/') {
      u = u.slice(0, -1);
    }
    u = u.replace(/#/g, '');
  }
  return u;
}

export function btoa_safe(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function atob_safe(str) {
  return decodeURIComponent(escape(atob(str)));
}

export function items(obj) {
  const res = [];
  for (const key in obj) {
    res.push([key, obj[key]]);
  }
  return res;
}

export function zip(...args) {
  const min = args.length === 0 ? [] : args.reduce((a, b) => a.length < b.length ? a : b);
  return min.map((_, i) => args.map(array => array[i]));
}

export function range(start, end) {
  const r = [];
  for (let i = start; i < end; ++i) {
    r.push(i);
  }
  return r;
}

export function dict(d) {
  const r = {};
  for (let [key, val] of d) {
    r[key] = val;
  }
  return r;
}

export function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}