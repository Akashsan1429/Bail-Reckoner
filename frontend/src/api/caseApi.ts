import { api } from './axios'
import type { CaseDto, CreateCaseRequest, UpdateCaseRequest, VerdictDto } from '../types/api'

export const caseApi = {
  createCase: async (data: CreateCaseRequest): Promise<CaseDto> => {
    const res = await api.post<CaseDto>('/cases', data)
    return res.data
  },

  getCases: async (): Promise<CaseDto[]> => {
    const res = await api.get<CaseDto[]>('/cases')
    return res.data
  },

  getCaseById: async (id: string): Promise<CaseDto> => {
    const res = await api.get<CaseDto>(`/cases/${id}`)
    return res.data
  },

  updateCase: async (id: string, data: UpdateCaseRequest): Promise<CaseDto> => {
    const res = await api.put<CaseDto>(`/cases/${id}`, data)
    return res.data
  },

  deleteCase: async (id: string): Promise<void> => {
    await api.delete(`/cases/${id}`)
  },

  evaluateCase: async (caseId: string): Promise<VerdictDto> => {
    const res = await api.post<VerdictDto>(`/cases/${caseId}/evaluate`)
    return res.data
  },

  getVerdicts: async (caseId: string): Promise<VerdictDto[]> => {
    const res = await api.get<VerdictDto[]>(`/cases/${caseId}/verdicts`)
    return res.data
  },
}
