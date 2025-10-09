import { apiCall } from '@/components/function/apiCall'

export interface ReportItem {
  reportId?: number;
  accountName?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  reportType?: number | string;
  reply?: string | null;
  postTime?: string | number | Date;
  comment?: string;
}

export const typeText = (v: unknown): string => {
  const map: Record<string, string> = {
    '1': '宿舍设施', '2': '教学设备', '3': '公共区域', '4': '网络与软件', '5': '其他'
  }
  const key = String(v ?? '')
  return map[key] || '未分类'
}

export const statusText = (v: unknown): string => {
  const map: Record<string, string> = {
    '0': '待处理', '2': '已完成'
  }
  const key = String(v ?? '0')
  return map[key] || '待处理'
}

export const statusFromReply = (item: ReportItem): '0' | '2' => {
  const replied = !!(item?.reply && String(item.reply).trim() !== '')
  return replied ? '2' : '0'
}

export const formatTime = (v: unknown): string => {
  try {
    const d = new Date(typeof v === 'number' ? v : String(v))
    if (isNaN(d.getTime())) return '-'
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${dd} ${hh}:${mm}`
  } catch {
    return '-'
  }
}

export type ReportScope = 'student' | 'all' | 'accepted'

export const fetchReports = async (
  scope: ReportScope,
  pageNum?: number
): Promise<ReportItem[]> => {
  let api: 'studentGet' | 'normalAdminGet' | 'getAcceptPost'
  switch (scope) {
    case 'student':
      api = 'studentGet'
      break
    case 'accepted':
      api = 'getAcceptPost'
      break
    default:
      api = 'normalAdminGet'
  }

  const query: Record<string, unknown> | undefined = pageNum && pageNum > 0 ? { pageNum } : undefined

  interface PagedResponse {
    records: ReportItem[]
    total: number
    size: number
    current: number
    pages: number
  }

  const res = await apiCall(api, undefined, query)
  const raw = res?.data as unknown

  const isPagedResponse = (v: unknown): v is PagedResponse => {
    if (typeof v !== 'object' || v === null) return false
    const maybe = v as PagedResponse
    return Array.isArray(maybe.records)
  }

  const list: ReportItem[] = Array.isArray(raw)
    ? (raw as ReportItem[])
    : (isPagedResponse(raw) ? raw.records : [])
  return list
}


