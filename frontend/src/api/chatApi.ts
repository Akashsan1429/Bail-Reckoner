import { api } from './axios'
import type { ChatMessageRequest, ChatResponse } from '../types/api'

export const chatApi = {
  sendMessage: async (data: ChatMessageRequest): Promise<ChatResponse> => {
    const res = await api.post<ChatResponse>('/chat/message', data)
    return res.data
  },
}
