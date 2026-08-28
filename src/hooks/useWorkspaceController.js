import { useNavigate, useLocation } from 'react-router-dom';
import { useToastStore } from '../components/common/Toast';
import api from '../utils/api';

export function useWorkspaceController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToastStore();

  const getCurrentContext = () => {
    const path = location.pathname;
    let currentModule = 'GENERAL';
    if (path.startsWith('/learn')) currentModule = 'LEARN';
    else if (path.startsWith('/practice')) currentModule = 'PRACTICE';
    else if (path.startsWith('/codelab')) currentModule = 'CODELAB';
    else if (path.startsWith('/interview')) currentModule = 'INTERVIEW';
    else if (path.startsWith('/quiz')) currentModule = 'QUIZ';
    else if (path.startsWith('/teacher')) currentModule = 'FACULTY';
    else if (path.startsWith('/admin')) currentModule = 'ADMIN';

    return {
      pathname: path,
      module: currentModule
    };
  };

  const dispatchAIAction = async (actionName, params = {}) => {
    try {
      addToast(`AI Executing: ${actionName}...`, 'info');
      const res = await api.post('/ai/action', { action: actionName, params });
      const data = res.data?.data;

      if (data?.type === 'NAVIGATE' && data?.route) {
        navigate(data.route);
        addToast(data.message || `Navigated to ${data.route}`, 'success');
      } else if (data?.type === 'MEMORY_UPDATE') {
        addToast(data.message || 'AI Memory Updated', 'success');
      }

      return data;
    } catch (err) {
      console.warn('AI Action execution error:', err);
      addToast(`Action failed: ${err.message}`, 'error');
      return null;
    }
  };

  const dispatchActionChain = async (chain = []) => {
    try {
      addToast(`AI Executing ${chain.length}-step workflow...`, 'info');
      const res = await api.post('/ai/action', { actionChain: chain });
      const results = res.data?.data?.actionChain || [];

      results.forEach(step => {
        if (step.result?.type === 'NAVIGATE' && step.result?.route) {
          navigate(step.result.route);
        }
      });

      addToast('Workflow completed successfully!', 'success');
      return results;
    } catch (err) {
      console.warn('AI Chain execution error:', err);
      addToast('Workflow execution encountered error', 'error');
      return [];
    }
  };

  return {
    currentContext: getCurrentContext(),
    dispatchAIAction,
    dispatchActionChain
  };
}
