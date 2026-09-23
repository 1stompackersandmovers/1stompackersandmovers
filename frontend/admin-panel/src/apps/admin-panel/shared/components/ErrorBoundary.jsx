import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    console.log("Having issues :", error);
    console.log("Info : ", errorInfo);
  }

  reload() {
    return window.location.reload();
  }

  reset() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/";
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20">
          <h2 className="mb-2 text-xl font-semibold">
            Having error while rendering
          </h2>
          <p className="p-10 rounded-2xl bg-gray-900 text-red-500 mb-5">
            {this.state.error?.toString()}
          </p>

          <h2 className="mb-2 text-xl font-semibold">Error Info</h2>
          <p className="p-10 rounded-2xl bg-gray-900 text-red-500">
            {this.state.errorInfo?.componentStack}
          </p>

          {/* action buttons */}
          <div className="flex justify-center">
            <button
              className="flex px-5 py-2 m-5 rounded font-semibold text-gray-900 bg-yellow-600 cursor-pointer"
              onClick={this.reload}
            >
              Reload
            </button>
            <button
              className="flex px-5 py-2 m-5 rounded font-semibold text-gray-900 bg-yellow-600 cursor-pointer"
              onClick={this.reset}
            >
              Go to Dashborad
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
