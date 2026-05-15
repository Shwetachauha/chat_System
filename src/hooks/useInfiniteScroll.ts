import { useCallback, useRef } from 'react';
import { useAppDispatch } from './useAuth';
import { fetchMessages } from '@/store/slices/messageSlice';

export function useInfiniteScroll(chatId: string, hasMore: boolean, isLoading: boolean) {
  const dispatch = useAppDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || isLoading) return;
    loadingRef.current = true;

    dispatch(fetchMessages({ chatId })).finally(() => {
      loadingRef.current = false;
    });
  }, [chatId, hasMore, isLoading, dispatch]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, loadMore]
  );

  return { sentinelRef, loadMore };
}
