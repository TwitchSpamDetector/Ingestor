export type ListenerStatus = 'CONNECTING' | 'LISTENING' | 'DISCONNECTED';

export interface Listener {
  channelId: string;
  status: ListenerStatus;
  connectedSince?: string;
}

export interface CreateListenerRequest {
  channelId: string;
}
