export function post(func: () => void, timeout = 0) {
  setTimeout(() => {
    func();
  }, timeout);
}
