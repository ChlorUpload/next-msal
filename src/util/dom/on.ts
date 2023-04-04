import { Disposable } from "../Disposable/Disposable";

export function on<E extends Event>(
  target: EventTarget,
  eventName: string,
  listener: (event: E) => void
): Disposable {
  target.addEventListener(
    eventName,
    listener as EventListenerOrEventListenerObject
  );
  return () =>
    target.removeEventListener(
      eventName,
      listener as EventListenerOrEventListenerObject
    );
}
