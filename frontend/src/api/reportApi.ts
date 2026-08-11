import { api } from './axios'

export const reportApi = {
  downloadPdfReport: async (caseId: string, caseNumber?: string): Promise<void> => {
    const response = await api.post(`/cases/${caseId}/report`, null, {
      responseType: 'blob',
    })

    // Create a blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `bail_reckoner_report_${caseNumber || caseId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}
