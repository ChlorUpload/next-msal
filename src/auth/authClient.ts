import {
  createWatchTarget,
  WatchTargetSetter,
} from "@/util/WatchTarget/createWatchTarget";
import { IWatchTarget, WatchTarget } from "@/util/WatchTarget/WatchTarget";
import { Auth } from "./models/auth";

const tokenStates = ["idle", "tokenRefreshing", "sessionExpired"] as const;

type TokenRefreshState = typeof tokenStates[number];

export interface AuthManagerWatchMap {
  auth: Auth;
  tokenRefreshState: TokenRefreshState;
}

export class AuthClient implements IWatchTarget<AuthManagerWatchMap> {
  watch: WatchTarget<AuthManagerWatchMap>;
  _set: WatchTargetSetter<AuthManagerWatchMap>;

  constructor() {
    [this.watch, this._set] = createWatchTarget<AuthManagerWatchMap>({
      auth: {
        session: null,
        status: "loading",
      },
      tokenRefreshState: "idle",
    });
  }

  async init() {
    await this._refreshSession();
  }

  private async _refreshSession() {
    try {
      const res = await (await fetch("/api/auth/session")).json();
      if (res?.error === "Unauthorized") {
        this._set.auth({
          session: null,
          status: "unauthenticated",
        });
        return false;
      }

      if (res?.error === "SessionExpired") {
        this._set.auth({
          session: null,
          status: "unauthenticated",
        });
        this._set.tokenRefreshState("sessionExpired");
        return false;
      }

      this._set.auth({
        session: res,
        status: "authenticated",
      });
      this._set.tokenRefreshState("idle");

      return true;
    } catch {
      this._set.auth({
        session: null,
        status: "unauthenticated",
      });
      return false;
    }
  }

  /** updates session silently and returns token */
  async silentlyGetToken(): Promise<string | null> {
    const auth = this.watch.auth.value;
    if (auth.status !== "authenticated") return null;

    const expiry = new Date(auth.session.expires);
    if (new Date() < expiry) return auth.session.accessToken;

    this._set.tokenRefreshState("tokenRefreshing");
    const res = await this._refreshSession();
    return res ? auth.session?.accessToken ?? null : null;
  }

  async signIn() {
    const redirectTo = window.location.href;
    window.location.href = `/api/auth/login?${new URLSearchParams({
      redirectTo,
    })}`;
  }

  async signOut() {
    window.location.href = `/api/auth/logout`;
  }
}

export const authClient = new AuthClient();
