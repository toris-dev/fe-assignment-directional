import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ERROR_MESSAGES } from '../constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 바운더리 컴포넌트
 * React 컴포넌트 트리에서 발생한 에러를 캐치하고 처리합니다.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅 (실제 프로덕션에서는 에러 리포팅 서비스로 전송)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>⚠️ 오류가 발생했습니다</h2>
            <p>{ERROR_MESSAGES.UNKNOWN_ERROR}</p>
            {this.state.error && (
              <details className="error-details">
                <summary>에러 상세 정보</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <button onClick={this.handleReset} className="error-reset-button">
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

