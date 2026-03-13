import en from '../src/messages/en.json'
import zh from '../src/messages/zh.json'

function getKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null && !Array.isArray(v)
      ? getKeys(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  )
}

const enKeys = new Set(getKeys(en))
const zhKeys = new Set(getKeys(zh))

const missingInZh = [...enKeys].filter(k => !zhKeys.has(k))
const missingInEn = [...zhKeys].filter(k => !enKeys.has(k))

if (missingInZh.length) console.log('Missing in zh.json:', missingInZh)
if (missingInEn.length) console.log('Missing in en.json:', missingInEn)
if (!missingInZh.length && !missingInEn.length) console.log('✓ All keys in sync')
