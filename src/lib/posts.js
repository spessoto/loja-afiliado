import { useEffect, useState } from "react";
import { useInitial } from "./initialData.jsx";

export function usePosts() {
  const initial = useInitial("posts");
  const [posts, setPosts] = useState(initial || []);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    fetch("/api/posts")
      .then(res => (res.ok ? res.json() : []))
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading };
}

export function usePost(slug) {
  const initial = useInitial("post");
  const usaInitial = initial && initial.slug === slug;
  const [post, setPost] = useState(usaInitial ? initial : null);
  const [loading, setLoading] = useState(!usaInitial);

  useEffect(() => {
    if (usaInitial && post?.slug === slug) return;
    setLoading(true);
    fetch(`/api/posts/${slug}`)
      .then(res => (res.ok ? res.json() : null))
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading };
}
