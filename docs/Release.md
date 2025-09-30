## v1.1.2

Author: @Atik203

### Highlights – v1.1.2

- **Multi-Provider AI Service**: Comprehensive AI integration with Gemini 2.5-flash-lite (primary, free) and OpenAI gpt-4o-mini (secondary) with intelligent fallback system
- **AI Paper Summarization**: Production-grade paper summarization with performance optimization, caching, and comprehensive error handling
- **Intelligent Paper Insights**: Context-aware AI chat system allowing natural conversations about specific papers
- **Paper Context Integration**: AI maintains full awareness of paper content throughout entire chat conversations
- **Natural Language Interface**: Updated AI providers to return conversational responses for improved user experience
- **Cost-Effective Architecture**: Prioritized free AI models while maintaining high-quality responses and reliability

### Technical Implementation – v1.1.2

#### AI Service Architecture

- **BaseAiProvider Pattern**: Modular provider system with configurable fallback order ["gemini", "openai"]
- **Gemini Integration**: v1beta API with 2.5-flash-lite and 2.5-flash models, natural conversational responses
- **OpenAI Integration**: Cost-effective gpt-4o-mini model with structured JSON responses and error handling
- **Context Management**: Always include paper extracted text as context for AI insights and conversations
- **Performance Optimization**: Response caching, token usage monitoring, and request timeout handling
- **Production Testing**: 8/8 AI provider smoke tests passing with real API integration

#### Backend Improvements

- **Paper Controller**: Enhanced generateInsight endpoint to always include paper context
- **AI Cache System**: Intelligent caching for paper summaries and AI responses
- **Error Handling**: Production-grade error classes and fallback mechanisms
- **Provider Configuration**: Environment-based configuration with feature flags and API key management

#### Frontend Experience

- **Natural Chat Interface**: Fixed JSON response display, now shows conversational AI responses
- **Model Selection**: Updated AI model picker with Gemini prioritized as primary free option
- **Error Recovery**: Automatic retry logic for network errors and provider failover
- **Toast Integration**: Seamless error/success notifications using Sonner with proper retry handling

### Removed

- **Deepseek Provider**: Removed paid AI provider to focus on free, cost-effective solutions
- **JSON Chat Responses**: Eliminated technical JSON display in favor of natural conversation flow
