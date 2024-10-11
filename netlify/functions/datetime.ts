import type {Config, Context} from '@netlify/functions'
import {getStore} from '@netlify/blobs'

export default async function(_ : Request, context : Context) {

  const cacheFromQuery = context.url.searchParams.get('cache')
  const store = getStore({
    consistency: 'strong',
    name: 'config'
  })

  if (cacheFromQuery) {
    await store.setJSON('use_cache', cacheFromQuery === 'true' ? true : false)
    return Response.json({
      msg: 'success'
    })
  }
  
  const cacheOrNot = await store.get('use_cache', {
    type: 'json'
  })

  return new Response(`<html lang="en"><head><meta charset="utf-8"/><title>C03QEJB4CFP/p1728568138652629</title></head><body><script>const currentTime=document.createElement('span');const date=${Date.now()};const span=document.createElement('span');function dateToLocal(date){return new Date(date).toLocaleString()};function updateCurrentTime() {const now=Date.now();currentTime.innerText='current time: '+dateToLocal(now);setTimeout(updateCurrentTime,1000-(now%1000))};span.innerHTML='rendered at: '+new Date(date).toLocaleString()+'<br/>max-age: '+dateToLocal(date+(60*1000))+'<br/>swr: '+dateToLocal(date+(120*1000))+'<br/>';document.body.appendChild(span);document.body.appendChild(currentTime);updateCurrentTime();</script></body></html>`, {
    headers: {
      'content-type': 'text/html',
      'netlify-cdn-cache-control': cacheOrNot ? 'durable, max-age=60, public, stale-while-revalidate=120' : 'no-cache',
      'netlify-vary': 'query'
    }
  })

}

export const config : Config = {
  path: '/'
}
