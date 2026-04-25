/**
 * ShopEasy - JS Error Diagnostics
 * Catches all JS errors and reports them with stack traces
 * Added to all pages for debugging empty-string errors
 */
(function() {
    'use strict';

    // Catch all runtime errors
    window.onerror = function(msg, url, line, col, error) {
        console.log('[ERRDIAG] Global error:', {
            message: msg,
            url: url,
            line: line,
            col: col,
            stack: error ? error.stack : 'no stack',
            type: typeof msg
        });
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

    console.log('[ERRDIAG] Error diagnostics loaded');
})();
