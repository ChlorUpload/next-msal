import { Disposable } from "./Disposable";
import { UseAfterDisposeException } from "../exception/UseAfterDisposeException";
import { AnyDisposable, disposeAny } from "./disposeAny";

export interface DisposerBase extends Disposable {
  add(...items: AnyDisposable[]): this;
}

export interface DisposerMethod extends DisposerBase {}

export interface Disposer extends DisposerBase {
  createMethod(): DisposerMethod;
}

export function createDisposer(): Disposer {
  let disposeItems: AnyDisposable[][] | undefined = [];
  let disposeStarted = false;
  const methods: DisposerMethod[] = [];

  const result = function disposerDispose() {
    if (disposeStarted)
      throw new UseAfterDisposeException("Disposed more than once");
    disposeStarted = true;
    disposeAny(methods, disposeItems);
    disposeItems = undefined;
  } as Disposer;
  result.add = function disposerAdd(...items) {
    if (disposeStarted)
      throw new UseAfterDisposeException("Disposer is already disposed!");
    disposeItems!.push(items);
    return result;
  };
  result.createMethod = function createMethod() {
    let methodItems: AnyDisposable[][] = [];
    result.add(function disposerMethodDispose() {
      disposeAny(methodItems);
      methodItems = [];
    });
    const method = function invoke() {
      disposeAny(methodItems);
      methodItems = [];
    } as DisposerMethod;
    method.add = function disposerMethodAdd(...items) {
      if (disposeStarted)
        throw new UseAfterDisposeException(
          "Origin disposer is already disposed!",
        );
      methodItems.push(items);
      return method;
    };
    methods.push(method);
    return method;
  };
  return result;
}
