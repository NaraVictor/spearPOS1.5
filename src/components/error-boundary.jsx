import React from "react";
const log = require( 'log-to-file' )

export default function ErrorFallback ( { error, resetErrorBoundary } )
{
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{ error }</pre>
            <button onClick={ resetErrorBoundary }>Try again</button>
        </div>
    )
}


export class ErrorBoundary extends React.Component
{
    constructor ( props )
    {
        super( props );
        this.state = {
            hasError: false,
            error: {},
        };
    }

    static getDerivedStateFromError ( error )
    {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch ( error, errorInfo )
    {
        // You can also log the error to an error reporting service
        console.log( 'error ', error, ' error info ', errorInfo );
        log( errorInfo, 'error-log @ ' + new Date() )

    }

    render ()
    {
        if ( this.state.hasError )
        {
            // You can render any custom fallback UI
            return <ErrorFallback error={ this.state.error } />
        }

        return this.props.children;
    }
}

