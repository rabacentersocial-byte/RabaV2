/**
 * Production Background Task Queue
 * Ensures heavy side-effects (third-party API syncing, database mirror, file replication)
 * execute asynchronously without blocking API responses.
 */

type TaskFn = () => Promise<void>;

interface QueuedTask {
  id: string;
  name: string;
  fn: TaskFn;
  retries: number;
  maxRetries: number;
  enqueuedAt: number;
}

class BackgroundQueue {
  private queue: QueuedTask[] = [];
  private activeCount = 0;
  private readonly concurrency: number;

  constructor(concurrency = 3) {
    this.concurrency = concurrency;
  }

  /**
   * Enqueues a background task and immediately returns.
   * Does not wait for the task to complete.
   */
  public enqueue(name: string, fn: TaskFn, maxRetries = 2): void {
    const task: QueuedTask = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      fn,
      retries: 0,
      maxRetries,
      enqueuedAt: Date.now(),
    };

    this.queue.push(task);
    this.processNext();
  }

  private processNext(): void {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.activeCount++;

    (async () => {
      try {
        await task.fn();
      } catch (err) {
        if (task.retries < task.maxRetries) {
          task.retries++;
          const backoffMs = Math.pow(2, task.retries) * 500;
          setTimeout(() => {
            this.queue.unshift(task);
            this.processNext();
          }, backoffMs);
        } else {
          console.warn(`[BackgroundQueue] Task "${task.name}" (${task.id}) failed after ${task.retries} retries:`, err);
        }
      } finally {
        this.activeCount--;
        this.processNext();
      }
    })();
  }

  public get pendingCount(): number {
    return this.queue.length;
  }

  public get runningCount(): number {
    return this.activeCount;
  }
}

export const backgroundQueue = new BackgroundQueue(3);
