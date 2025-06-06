import { GlobalKeyboardListener } from 'node-global-key-listener';
import clipboardy from 'clipboardy';
import Queue from './queue.js';

const keyboardListener = new GlobalKeyboardListener();

let listening = false;
const queuedClipboardHistory = new Queue(100);

const handleCopyShortcutExecuted = async () => {
  const current = await clipboardy.read();

  queuedClipboardHistory.enqueue(current);

  const firstItem = queuedClipboardHistory.peek();
  if (firstItem) {
    await clipboardy.write(firstItem);
  }
}

const handlePasteShortcutExecuted = async () => {
  queuedClipboardHistory.dequeue();
  const firstItem = queuedClipboardHistory.peek();
  if (firstItem) {
    await clipboardy.write(firstItem);
  }
}

const handleClearClipboardHistory = () => {
  console.log('clipboard manager: cleared clipboard history');
  queuedClipboardHistory.reset();
}

keyboardListener.addListener(function (e, down) {
  const downKeys = down ? Object.keys(down).filter(key => down[key]) : [];
  if (downKeys.length === 3 && downKeys.includes('LEFT META') && downKeys.includes('LEFT SHIFT') && downKeys.includes('L')) {
    listening = !listening;
    if (listening) {
      console.log('clipboard manager: started');
      queuedClipboardHistory.reset();
    } else {
      console.log('clipboard manager: stopped');
      queuedClipboardHistory.reset();
    }
  }

  if (downKeys.length === 3 && downKeys.includes('LEFT META') && downKeys.includes('LEFT SHIFT') && downKeys.includes('C')) {
    handleClearClipboardHistory();
  }

  if (listening && downKeys.length === 2 && downKeys.includes('LEFT META')) {
    if (downKeys.includes('C')) {
      handleCopyShortcutExecuted();
    } else if (downKeys.includes('V')) {
      handlePasteShortcutExecuted();
    }
  }
});