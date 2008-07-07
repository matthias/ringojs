/**
 * A minimalist web framework that handles requests and provides
 * skin rendering services similar to helma 1, just that
 * module scopes replace hopobject hierarchies.
 */

importModule('core.string');
importModule('helma.rhino', 'rhino');
importModule('helma.continuation', 'continuation');
importModule('helma.simpleweb.*');

/**
 * Handler function that connects to the Helma servlet. Import this
 * into your main module scope:
 *
 * <code>importFromModule('helma.simpleweb', 'handleRequest');</code>
 *
 * @param req
 * @param res
 * @param session
 */
function handleRequest() {
    rhino.invokeCallback('onRequest', null, [request]);
    response.contentType = "text/html; charset=UTF-8";
    // resume continuation?
    if (continuation.resume()) {
        return;
    }
    // resolve path and invoke action
    var path = request.path.split('/');
    var handler = this;
    // first element is always empty string if path starts with '/'
    for (var i = 1; i < path.length -1; i++) {
        handler = handler[path[i]];
        if (!handler) {
            notfound();
            return;
        }
    }
    var lastPart = path[path.length - 1];
    var action = lastPart ?
                 lastPart.replace('.', '_', 'g') + '_action' :
                 'main_action';
    // response.writeln(handler, action, handler[action]);
    if (!(handler[action] instanceof Function)) {
        if (!request.path.endsWith('/') && handler[lastPart] &&
            handler[lastPart]['main_action'] instanceof Function) {
            response.redirect(req.path + '/');
        } else if (!handler[action]) {
            notfound();
            return
        }
    }
    try {
        handler[action].call(handler);
    } catch (e) {
        error(e);
    } finally {
        rhino.invokeCallback('onResponse', null, [response]);
    }
}

/**
 * Standard error page
 * @param e the error that happened
 */
function error(e) {
    response.status = 500;
    response.contentType = 'text/html';
    response.writeln('<h2>', e, '</h2>');
    if (e.fileName && e.lineNumber) {
        response.writeln('<p>In file<b>', e.fileName, '</b>at line<b>', e.lineNumber, '</b></p>');
    }
    if (e.rhinoException) {
        response.writeln('<h3>Script Stack</h3>');
        response.writeln('<pre>', e.rhinoException.scriptStackTrace, '</pre>');
        response.writeln('<h3>Java Stack</h3>');
        var writer = new java.io.StringWriter();
        var printer = new java.io.PrintWriter(writer);
        e.rhinoException.printStackTrace(printer);
        response.writeln('<pre>', writer.toString(), '</pre>');
    }
    return null;
}

/**
 * Standard notfound page
 */
function notfound() {
    response.status = 404;
    response.contentType = 'text/html';
    response.writeln('<h1>Not Found</h1>');
    response.writeln('The requested URL', request.path, 'was not found on the server.');
    return null;
}


