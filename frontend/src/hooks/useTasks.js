import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

export function useTasks(query, status, page, pageSize) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const controller = new AbortController();
      setLoading(true);
      setError(null);

      fetchTasks({ query, status, page, pageSize }, controller.signal)
        .then((data) => {
          setTasks(data.items || []);
          setTotal(data.total || 0);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            return;
          }
          setError(err.message);
          setLoading(false);
        });

      return () => controller.abort();
    }, 200);

    return () => clearTimeout(timer);
  }, [query, status, page, pageSize]);

  return { tasks, total, loading, error };
}
