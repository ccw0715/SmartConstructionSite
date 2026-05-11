import dayjs from 'dayjs'

export function formatDate(v, fmt = 'YYYY-MM-DD') {
  if (!v) return '-'
  return dayjs(v).format(fmt)
}

export function formatDateTime(v) {
  return formatDate(v, 'YYYY-MM-DD HH:mm:ss')
}

export function relativeTime(v) {
  if (!v) return '-'
  const now = dayjs()
  const t = dayjs(v)
  const diff = now.diff(t, 'minute')
  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff} 分钟前`
  if (diff < 60 * 24) return `${Math.floor(diff / 60)} 小时前`
  if (diff < 60 * 24 * 30) return `${Math.floor(diff / 60 / 24)} 天前`
  return t.format('YYYY-MM-DD')
}

export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
