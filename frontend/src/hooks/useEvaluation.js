import { useState, useEffect, useCallback } from 'react';
import { fetchEvaluation, fetchModelEvaluation } from '../services/api';

export function useEvaluation() {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvaluation();
      setEvaluation(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch evaluation data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { evaluation, loading, error, refetch: load };
}

export function useModelEvaluation(modelId) {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!modelId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchModelEvaluation(modelId);
      setEvaluation(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch model evaluation');
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  useEffect(() => {
    load();
  }, [load]);

  return { evaluation, loading, error, refetch: load };
}

export default useEvaluation;
