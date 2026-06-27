import { apiSlice } from "./apiSlice";

interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: string;
}

interface AIChatConversation {
  id: string;
  title?: string | null;
  model?: string | null;
  updatedAt: string;
  _count?: { messages: number };
}

interface ListConversationsResponse {
  conversations: AIChatConversation[];
}

interface ConversationResponse {
  id: string;
  title?: string | null;
  model?: string | null;
  messages: AIChatMessage[];
}

interface CreateConversationRequest {
  title: string;
  model: string;
  context?: { type: string; id?: string; title?: string };
}

interface SendMessageRequest {
  convId: string;
  content: string;
}

interface SendMessageResponse {
  id: string;
  content: string;
  model?: string;
}

export const aiChatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listConversations: builder.query<AIChatConversation[], void>({
      query: () => "/ai-chat",
      transformResponse: (response: { data: ListConversationsResponse }) =>
        response.data?.conversations ?? [],
      providesTags: ["AIChat"],
    }),

    createConversation: builder.mutation<AIChatConversation, CreateConversationRequest>({
      query: (body) => ({
        url: "/ai-chat",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: AIChatConversation }) => response.data,
      invalidatesTags: ["AIChat"],
    }),

    getConversation: builder.query<ConversationResponse, string>({
      query: (id) => `/ai-chat/${id}`,
      transformResponse: (response: { data: ConversationResponse }) => response.data,
      providesTags: (_result, _err, id) => [{ type: "AIChat", id }],
    }),

    deleteConversation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ai-chat/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        "AIChat",
        { type: "AIChat", id },
      ],
    }),

    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ convId, content }) => ({
        url: `/ai-chat/${convId}/messages`,
        method: "POST",
        body: { content },
      }),
      transformResponse: (response: { data: SendMessageResponse }) => response.data,
      invalidatesTags: (_result, _err, { convId }) => [
        { type: "AIChat", id: convId },
      ],
    }),
  }),
});

export const {
  useListConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useDeleteConversationMutation,
  useSendMessageMutation,
} = aiChatApi;
