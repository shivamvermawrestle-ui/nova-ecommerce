import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Application render error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center bg-[#F7F9FC] text-[#202C50] dark:bg-[#171E30] dark:text-[#EAF0FA]"
        >
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-[#64718A] dark:text-[#AAB8D0]">Reload the page and try again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-[#202C50] px-5 py-3 text-white transition-colors hover:bg-[#344F82] dark:bg-[#7895C5] dark:text-[#171E30] dark:hover:bg-[#9BB2D8]"
          >
            Reload page
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
