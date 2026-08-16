import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
            <p className="text-gray-600 text-sm mb-6">
              Une erreur inattendue s'est produite lors du chargement de la page. Ne vous inquiétez pas, vos données sont en sécurité.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
