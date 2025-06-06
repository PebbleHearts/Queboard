class Queue {
  constructor(maxItems = 100) {
    this.items = [];
    this.maxItems = maxItems;
  }

  enqueue(item) {
    if (this.items.length >= this.maxItems) {
      this.items.shift();
    }

    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  reset() {
    this.items = [];
  }
}

export default Queue;