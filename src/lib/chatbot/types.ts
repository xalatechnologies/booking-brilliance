export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  /** Optional citation back to the FAQ entry that informed the answer */
  sourceQ?: string;
  /** Optional suggestions to show as quick-reply chips after this message */
  suggestions?: string[];
  /** Optional CTA to switch to inquiry mode */
  showInquiryCta?: boolean;
  /** Optional CTA to book demo */
  showDemoCta?: boolean;
  timestamp: number;
}

export type Persona = "kommune" | "utleier" | "annet" | null;

export interface InquiryDraft {
  /** Who is asking */
  persona: Persona;
  /** What they need help with — free text or selected suggestion */
  topic: string;
  /** Organization name (kommune navn or selskap) */
  organization: string;
  /** Contact person */
  name: string;
  email: string;
  phone: string;
  /** Free-form message */
  message: string;
  /** Conversation context to include with the inquiry */
  contextSummary?: string;
}

export type Mode = "chat" | "inquiry-persona" | "inquiry-topic" | "inquiry-contact" | "inquiry-success";

export interface ChatState {
  open: boolean;
  mode: Mode;
  messages: ChatMessage[];
  inquiry: InquiryDraft;
  /** True while waiting on AI response */
  thinking: boolean;
  /** Surfaced error from RAG/inquiry submit */
  error: string | null;
}
