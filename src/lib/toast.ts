type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  message: string;
  type: ToastType;
};

type Listener = (toast: ToastMessage | null) => void;

let listener: Listener | null = null;
let idCounter = 0;

export const toast = {
  success(message: string) {
    listener?.({ id: ++idCounter, message, type: "success" });
  },
  error(message: string) {
    listener?.({ id: ++idCounter, message, type: "error" });
  },
  info(message: string) {
    listener?.({ id: ++idCounter, message, type: "info" });
  },
  subscribe(fn: Listener) {
    listener = fn;
    return () => {
      if (listener === fn) listener = null;
    };
  },
};
