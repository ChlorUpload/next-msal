export type Disposable = () => void;

export interface IDisposable {
  dispose: Disposable;
}
