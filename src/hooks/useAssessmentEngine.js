import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useToastStore } from '../components/common/Toast';

export const useAssessmentEngine = (config) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // Default 30 mins
  const [isFinished, setIsFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [score, setScore] = useState(0);
  const [evaluation, setEvaluation] = useState([]);
  const { addToast } = useToastStore();

  const discoverTopics = useCallback(async (query) => {
    if (!query) return null;
    setIsGenerating(true);
    try {
      const response = await api.post('/assessments/discover', { query });
      if (response.data.success) {
        return response.data.data; // { domain, subtopics }
      }
      return null;
    } catch (err) {
      console.error('Discovery Error:', err);
      if (err.response?.status === 401) {
        addToast('Session expired. Please login again.', 'error');
      } else {
        addToast('AI Discovery Failed. Please check your API key.', 'error');
      }
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [addToast]);

  const generateAssessment = useCallback(async (subject, topic) => {
    if (!topic) {
      addToast('Please select a topic first', 'warning');
      return false;
    }
    
    setIsGenerating(true);
    try {
      const response = await api.post('/assessments/generate', { subject, topic });
      if (response.data.success) {
        const genQs = response.data.questions;
        setQuestions(genQs);
        setUserAnswers(new Array(genQs.length).fill(null));
        setTimeLeft(genQs.length * 90); // 90 seconds per question
        setIsFinished(false);
        setCurrentQ(0);
        return true;
      }
    } catch (err) {
      console.error('Assessment Generation Error:', err);
      if (err.response?.status === 401) {
        addToast('Session expired. Please login again.', 'error');
      } else {
        const errorMsg = err.response?.data?.message || 'AI Generation Failed. Please check your connection.';
        addToast(errorMsg, 'error');
      }
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, [addToast]);

  const handleAnswer = useCallback((answer) => {
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[currentQ] = answer;
      return updated;
    });

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      finishAssessment();
    }
  }, [currentQ, questions]);

  const finishAssessment = useCallback(async (finalStrikes = 0) => {
    if (isFinished) return;
    setIsFinished(true);

    let finalScore = 0;
    const details = questions.map((q, i) => {
      const userAnswer = userAnswers[i];
      let isCorrect = false;

      if (q.type === 'multiple_choice' || !q.type) {
        isCorrect = userAnswer === (q.correctOptionIndex || q.correct);
      } else {
        isCorrect = userAnswer?.toString().toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim();
      }

      if (isCorrect) finalScore++;

      return {
        id: i + 1,
        question: q.text || q.question,
        userAnswer: q.type === 'multiple_choice' ? (q.options[userAnswer] || 'Not Answered') : (userAnswer || 'Not Answered'),
        correctAnswer: q.type === 'multiple_choice' ? (q.options[q.correctOptionIndex || q.correct]) : q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        time: 'N/A'
      };
    });

    const accuracy = questions.length > 0 ? (finalScore / questions.length) * 100 : 0;

    setScore(finalScore);
    setEvaluation(details);

    try {
      await api.post('/assessments/save', {
        subject: config?.subject || 'General',
        topic: config?.topic || 'General',
        level: 'Pro',
        score: finalScore,
        totalQuestions: questions.length,
        accuracy,
        strikes: finalStrikes,
        details
      });
      addToast('Assessment completed and results saved!', 'success');
    } catch (err) {
      console.error('Failed to save results:', err);
    }
  }, [isFinished, questions, userAnswers, config, addToast]);

  useEffect(() => {
    if (!isFinished && questions.length > 0 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished && questions.length > 0) {
      finishAssessment();
    }
  }, [isFinished, questions.length, timeLeft, finishAssessment]);

  return {
    questions,
    currentQ,
    setCurrentQ,
    userAnswers,
    timeLeft,
    isFinished,
    isGenerating,
    score,
    evaluation,
    discoverTopics,
    generateAssessment,
    handleAnswer,
    finishAssessment
  };
};
