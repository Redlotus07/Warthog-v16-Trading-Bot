// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('UI Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.resetError()} />;
    }
    return this.props.children;
  }
}
