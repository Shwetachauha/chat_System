import { Message } from '@/types';

interface QueuedMessage {
  message: Message;
  retryCount: number;
  timestamp: number;
}

class MessageQueue {
  private queue: QueuedMessage[] = [];
  private maxRetries = 3;
  private isProcessing = false;
  private processFn: ((msg: Message) => Promise<void>) | null = null;

  setProcessor(fn: (msg: Message) => Promise<void>): void {
    this.processFn = fn;
  }

  enqueue(message: Message): void {
    this.queue.push({
      message,
      retryCount: 0,
      timestamp: Date.now(),
    });
    this.process();
  }

  private async process(): Promise<void> {
    if (this.isProcessing || !this.processFn || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];

      try {
        await this.processFn(item.message);
        this.queue.shift();
      } catch {
        item.retryCount++;
        if (item.retryCount >= this.maxRetries) {
          this.queue.shift();
          // Message failed permanently - handled by the caller
        } else {
          // Move to end of queue for retry
          this.queue.shift();
          this.queue.push(item);
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, item.retryCount) * 1000)
          );
        }
      }
    }

    this.isProcessing = false;
  }

  clear(): void {
    this.queue = [];
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  getQueue(): QueuedMessage[] {
    return [...this.queue];
  }
}

export const messageQueue = new MessageQueue();
