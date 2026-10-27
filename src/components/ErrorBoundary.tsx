import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
    if (
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed')
    ) {
      if (typeof window !== 'undefined' && !sessionStorage.getItem('raba_err_reload')) {
        sessionStorage.setItem('raba_err_reload', 'true');
        window.location.reload();
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto text-2xl font-bold">
              ✨
            </div>
            <h2 className="text-xl font-black text-white">مركز رابا للتأهيل</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              حدث تنبيه غير متوقع أثناء عرض هذه الصفحة. يمكنك المحاولة مجدداً عبر تحديث الصفحة.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-black shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              >
                تحديث الصفحة ↻
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('raba_specialist_settings');
                  } catch {}
                  this.setState({ hasError: false });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors"
              >
                إعادة المحاولة
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
