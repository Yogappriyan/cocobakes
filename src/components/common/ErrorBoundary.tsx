import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset() {
    this.setState({ hasError: false, error: null });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-sm text-center max-w-lg mx-auto my-8 space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#23120B]">
            {this.props.fallbackTitle || 'Something went wrong rendering this section'}
          </h3>
          <p className="text-xs text-[#3E2723]/70">
            {this.props.fallbackMessage ||
              'A temporary issue occurred while loading this view. You can reload the view or reset local cache.'}
          </p>
          {this.state.error && (
            <p className="text-[10px] font-mono text-rose-700 bg-rose-50 p-2 rounded-lg break-all text-left">
              {this.state.error.message}
            </p>
          )}
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-[#23120B] text-[#FAF7F2] hover:bg-[#C59B27] rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#FAF7F2] text-[#23120B] border border-[#2D1810]/15 hover:bg-[#EADBC8]/40 rounded-xl text-xs font-semibold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
