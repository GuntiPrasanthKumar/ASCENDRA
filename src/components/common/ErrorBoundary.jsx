import React, { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200/50 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-800 mb-3">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              ASCENDRA encountered an unexpected rendering error. Don't worry, your learning progress is safe.
            </p>
            {this.state.error && (
              <pre className="w-full text-left bg-slate-900 text-slate-400 p-4 rounded-2xl text-[10px] font-mono overflow-x-auto mb-8 border border-white/5 max-h-40">
                <code>{this.state.error.toString()}</code>
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <RotateCcw className="w-4 h-4" /> Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
