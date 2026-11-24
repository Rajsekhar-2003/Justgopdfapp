import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { /* never log document contents */ }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container py-5 text-center">
        <h1 className="h3">Something went wrong</h1>
        <p className="text-muted">The page hit an unexpected error. Your files were not uploaded anywhere.</p>
        <button type="button" className="btn btn-red" onClick={() => window.location.reload()}>Reload page</button>
      </div>
    );
  }
}
