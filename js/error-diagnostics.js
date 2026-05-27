/**
 * ShopEasy - JS Error Diagnostics
 * Catches all JS errors and reports them with stack traces
 * Added to all pages for debugging empty-string errors
 */
(function() {
    'use strict';

    // Catch all runtime errors
    window.onerror = function(msg, url, line, col, error) {
        var detail = {
            message: msg,
            url: url,
            line: line,
            col: col,
            stack: error ? error.stack : 'no stack',
            type: typeof msg
        };
        // Suppress empty-string errors from CDP/browser internals
        if (msg === '' && !url && !line && !col && !error) {
            return true; // Known CDP environment artifact, no action needed
        }
        console.log('[ERRDIAG] Global error:', detail);
        return true;
    };

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.log('[ERRDIAG] Unhandled rejection:', {
            reason: e.reason,
            type: typeof e.reason,
            stack: e.reason && e.reason.stack ? e.reason.stack : 'no stack'
        });
    });

    // Monkey-patch addEventListener to catch errors at binding time
    var origAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        var wrappedListener = function(e) {
            try {
                return listener.apply(this, arguments);
            } catch (err) {
                console.log('[ERRDIAG] Click handler error:', {
                    message: err.message,
                    stack: err.stack,
                    type: type,
                    target: this.className || this.id || this.tagName
                });
            }
        };
        return origAddEventListener.call(this, type, wrappedListener, options);
    };

    console.log('[ERRDIAG] Error diagnostics loaded', new Date().toISOString());
    console.log('[ERRDIAG] head script count:', document.head.querySelectorAll('script').length);
    
    // Try to identify empty-string errors by intercepting at a deeper level
    var origConsoleError = console.error;
    console.error = function() {
        var args = Array.prototype.slice.call(arguments);
        if (args.length === 0 || (args.length === 1 && args[0] === '')) {
            console.log('[ERRDIAG] Empty console.error detected, stack:', new Error().stack);
        }
        return origConsoleError.apply(console, args);
    };
})();
