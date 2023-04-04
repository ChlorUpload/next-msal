import { usePersist } from "@/util/react/hooks/usePersist";
import { useEffect, useMemo, useState } from "react";
import { useTokenRefreshState } from "./useTokenRefreshState";

export function AuthStateIndicator() {
  const state = useTokenRefreshState();

  const [anim, setAnim] = useState(false);

  const needShow = useMemo(
    () => state === "tokenRefreshing" || state === "sessionExpired",
    [state]
  );
  const timer = usePersist<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!needShow) return;
    setAnim(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAnim(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needShow]);

  useEffect(() => {
    // on unmount
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (needShow || anim)
    return (
      <div className="fixed left-[30px] bottom-[30px] bg-[#00000088] text-[white] px-[24px] py-[20px] rounded-[4px] flex items-center gap-[14px]">
        {state === "tokenRefreshing" && "로그인 세션 자동 연장 중"}
        {state === "sessionExpired" && "세션이 만료되었습니다. 로그아웃 중"}
      </div>
    );

  return null;
}
