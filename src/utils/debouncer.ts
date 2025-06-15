type AnyFunction = (...args: any[]) => void;

const debouncer = (fn: AnyFunction = () => {}, delay = 1000) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<typeof fn>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export { debouncer };
