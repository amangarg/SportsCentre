var Spectrum = Spectrum || { correlationId: null };

(function () {
  Spectrum.Analytics = function () {
    if (!(this instanceof arguments.callee)) {
      return new arguments.callee();
    }
    var source = "Spectrum Analytics";

    var log = function () {
      try {
        var args = standardArguments(arguments),
          data = args.options && args.options.data ? args.options.data : {},
          url = args.options && args.options.url ? args.options.url : null;

        if (!url) {
          throw Error("Invalid arguments: log({options object}|{options object[, callback function]} - options must include url property.");
        }

        if (!Spectrum.correlationId) {
          Spectrum.correlationId = guid().newGuid();
        }

        data.correlation_id = Spectrum.correlationId;
        data.url = location.href;
        data.referer = document.referrer;

        Spectrum.Ajax().post(url,
          data,
          function (result) { handleSuccess(result, data, args); },
          function (xhr, status, errorThrown) {
            if (xhr.statusText === "OK") {
              handleSuccess(xhr.responseText, data, args);
              return;
            };
            handleError(xhr, status, errorThrown, args);
          });
      }
      catch (exception) { handleException(exception, arguments); }
    };

    var handleSuccess = function (result, data, args) {
      Spectrum.isObject(args.options) && Spectrum.isFunction(args.options.success) && args.options.success(result);
      Spectrum.isFunction(args.callback) && args.callback({ statusText: "OK", responseText: result }, data);
    };

    var handleError = function (xhr, status, errorThrown, args) {
      Spectrum.Console().error(source, xhr.statusText);
      if (Spectrum.isObject(args.options) && Spectrum.isFunction(args.options.error)) { args.options.error(xhr, status, errorThrown); }
      Spectrum.isFunction(args.callback) && args.callback(xhr);
    };

    var handleException = function (exception, args) {
      Spectrum.Console().error(source, exception.message);
      try {
        args = standardArguments(Array.prototype.slice.call(args, 0, 2));
        Spectrum.isFunction(args.callback) && args.callback({ statusText: "Error", responseText: null });
      } catch (exception) { /* attempt callback, suppress error */ }
    };

    var standardArguments = function (args) {
      switch (args.length) {
        case 0:
          return {};
        case 1:
          if (Spectrum.isObject(args[0])) {
            return { options: args[0] };
          } else if (Spectrum.isFunction(args[0])) {
            return { callback: args[0] };
          }
          break;
        case 2:
          if (Spectrum.isObject(args[0]) && Spectrum.isFunction(args[1])) {
            return {
              options: args[0],
              callback: args[1]
            };
          }
          break;
        default:
          throw Error("Too many arguments (" + args.length + "): log([options object]|[callback function]|[options object, callback function])");
      }
      throw Error("Invalid arguments: log({options object}|{options object[,callback function]}");
    };

    var guid = function () {
      if (!(this instanceof arguments.callee)) {
        return new arguments.callee();
      }
      var s4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      var newGuid = function() {
        return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
      };

      return {
        newGuid: newGuid
      };
    };

    return {
      log: log
    };
  };

  Spectrum.Ajax = function () {
    if (!(this instanceof arguments.callee)) {
      return new arguments.callee();
    }

    var post = function (url, data, successHandler, errorHandler) {
      jQuery.ajax(url, {
        async: true,
        cache: false,
        type: "POST",
        contentType: "application/json; utf-8",
        data: JSON.stringify(data),
        success: Spectrum.isFunction(successHandler) ? successHandler : function () { },
        error: Spectrum.isFunction(errorHandler) ? errorHandler : function () { }
      });
    };

    return {
      post: post
    };
  };

  Spectrum.Console = function () {
    var log = function (message) {
      if ((!Spectrum.isConsole(window.console) && !Spectrum.isObject(window.console)) || !Spectrum.isFunction(window.console.log)) return;
      console.log(message);
    }

    var error = function (errorSource, errorMessage) {
      if ((!Spectrum.isConsole(window.console) && !Spectrum.isObject(window.console)) || !Spectrum.isFunction(window.console.error)) return;
      console.error(errorSource, errorMessage);
    };

    return {
      log: log,
      error: error
    };
  };

  Spectrum.isFunction = function (theVariable) {
    var obj = {};
    return theVariable && obj.toString.call(theVariable) === "[object Function]";
  };

  Spectrum.isObject = function (theVariable) {
    var obj = {};
    return theVariable && obj.toString.call(theVariable) === "[object Object]";
  };

  Spectrum.isConsole = function (theVariable) {
    var obj = {};
    return theVariable && obj.toString.call(theVariable) === "[object Console]";
  };

  Spectrum.Console().log("Spectrum v1 loaded.");
  jQuery(document).trigger("spectrum-load");
})();
