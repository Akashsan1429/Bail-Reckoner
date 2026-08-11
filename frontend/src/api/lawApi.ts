import { api } from './axios'
import type { LawSectionDto } from '../types/api'

export const lawApi = {
  getAllLaws: async (): Promise<LawSectionDto[]> => {
    const res = await api.get<LawSectionDto[]>('/laws')
    return res.data
  },

  getLawById: async (id: string): Promise<LawSectionDto> => {
    const res = await api.get<LawSectionDto>(`/laws/${id}`)
    return res.data
  },

  searchLaws: async (query: string): Promise<LawSectionDto[]> => {
    const res = await api.get<LawSectionDto[]>('/laws/search', {
      params: { query },
    })
    return res.data
  },
}
