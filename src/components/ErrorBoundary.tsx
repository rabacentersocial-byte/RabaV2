import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  private handleReset = () => {
    try {
      this.setState({ hasError: false, error: null });
    } catch {
      this.handleReload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1320] text-slate-100 flex items-center justify-center p-4" dir="rtl">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              مركز رابا للرعاية والتأهيل
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              حدث خطأ غير متوقع أثناء تحميل الصفحة. يرجى إعادة تحديث الصفحة أو العودة للرئيسية.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0f766e] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل الصفحة</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>المتابعة</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
