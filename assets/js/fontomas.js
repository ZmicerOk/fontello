/*global _, Handlebars*/

var Fontomas = (function (Fontomas) {
  "use strict";

  var cfg, env, debug, logger = {}, tpl_cache = {};


  cfg = {
    // class icon_size_prefix+"-<num>" added when icon size has changed
    icon_size_prefix:   "fm-icon-size-",
    icon_size_classes:  "", // precalculated by initCfg()

    preview_icon_sizes: [32, 24, 16],
    live_update:        true,
    fix_edges:          true,
    scale_precision:    6, // truncate the mantissa when scaling svg paths

    path_options: {
      "fill":         "#000",
      "stroke":       "#000",
      "stroke-width": 0
    },
    output: {
      filename:     "fontomas.svg",
      font_id:      "FontomasCustom",
      horiz_adv_x:  500,
      units_per_em: 1000,
      ascent:       750,
      descent:      -250,
      metadata:     "This is a custom SVG font generated by Fontomas",
      missing_glyph_horiz_adv_x: 500
    }
  };

  // environment
  env = {
    is_file_proto:  (window.location.protocol === "file:"),
    filereader:     null
  };

  debug = {is_on: false};

  // init icon_size_classes
  cfg.icon_size_classes = cfg.preview_icon_sizes.map(function (item) {
    return cfg.icon_size_prefix+item;
  }).join(" ");

  // usage: index.html#debug:maxglyphs=10,noembedded,nofilereader
  _.each(window.location.hash.substr(1).split("&"), function (str) {
    var vars = str.split(":");

    if ("debug" === vars.shift()) {
      debug.is_on = true;

      if (vars.length) {
        _.each(vars.shift().split(","), function (str) {
          var pair = str.split("=");
          debug[pair[0]] = pair[1] && pair[1] !== "" ? pair[1] : true;
        });
      }
    }
  });


  logger.assert =
  logger.error  =
  logger.debug  = function () {};

  if (debug.is_on) {
    logger.assert = console.assert;
    logger.error  = console.error;
    logger.debug  = console.debug;
  }


  // public interface
  return $.extend(true, Fontomas, {
    cfg:          cfg,
    env:          env,
    debug:        debug,
    models:       {},
    views:        {},
    render:       function (id, locals) {
      var $tpl;

      if (!tpl_cache[id]) {
        $tpl = $('[data-tpl-id=' + id + ']').remove();
        tpl_cache[id] = Handlebars.compile($tpl.html());
      }

      return tpl_cache[id](locals || {});
    },
    logger:       logger
  });
}(Fontomas || {}));
