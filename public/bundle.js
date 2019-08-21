(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Requester_1 = require("./nkui/Requester");
exports.Requester = Requester_1.Requester;
var UI_1 = require("./nkui/UI");
exports.UI = UI_1.UI;
var UIComponent_1 = require("./nkui/UIComponent");
exports.UIComponent = UIComponent_1.UIComponent;
var UIX_1 = require("./nkui/UIX");
exports.UIX = UIX_1.UIX;
var UIXButton_1 = require("./nkui/UIXButton");
exports.UIXButton = UIXButton_1.UIXButton;
var UIXField_1 = require("./nkui/UIXField");
exports.UIXField = UIXField_1.UIXField;
var ViewManager_1 = require("./nkui/ViewManager");
exports.ViewManager = ViewManager_1.ViewManager;

},{"./nkui/Requester":2,"./nkui/UI":3,"./nkui/UIComponent":4,"./nkui/UIX":5,"./nkui/UIXButton":6,"./nkui/UIXField":7,"./nkui/ViewManager":8}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Simple XMLHttpRequest requester.
 */
var Requester = /** @class */ (function () {
    /**
     * Configure the Requester
     * @param method default method used for this Requester.
     * @param url url base for all requests.
     */
    function Requester(method, url) {
        this._method = method;
        this._url = url;
        this._headers = {};
        this._path = "";
    }
    /**
     * Define an header attribute for all requests.
     * @param key header name
     * @param value header value
     */
    Requester.prototype.header = function (key, value) {
        this._headers[key] = value;
        return this;
    };
    /**
     * The resource name for compose the URL.
     * @param value resource name
     */
    Requester.prototype.path = function (value) {
        this._path = value;
        return this;
    };
    /**
     * Create an request and response as json objects.
     * @param obj request to send.
     * @param onResult callback for response.
     * @param onError callback for errors.
     */
    Requester.prototype.json = function (obj, onResult, onError) {
        this.header('Content-Type', 'application/json;charset=UTF-8');
        this.header('Accept', 'application/json');
        var body = null;
        if (obj) {
            body = JSON.stringify(obj);
        }
        this.write(body, function (xhr) {
            onResult(JSON.parse(xhr.responseText));
        }, onError);
    };
    /**
     * Write the request to server.
     * @param body the content to send
     * @param onResult callback with response
     * @param onError callback with error
     */
    Requester.prototype.write = function (body, onResult, onError) {
        var urlc = this._url + this._path;
        console.log('>>: ' + this._method + ' ' + urlc);
        var xhr = new XMLHttpRequest();
        xhr.open(this._method, urlc);
        var keys = Object.keys(this._headers);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            xhr.setRequestHeader(k, this._headers[k]);
        }
        xhr.onreadystatechange = function (e) {
            var _xhr = e.target;
            if (_xhr.readyState == 4) {
                if (_xhr.status == 200) {
                    onResult(_xhr);
                }
                else {
                    console.error(_xhr.statusText);
                    if (onError) {
                        onError(_xhr.statusText);
                    }
                }
            }
        };
        if (onError) {
            xhr.onerror = function (e) {
                onError(xhr.statusText);
            };
        }
        xhr.send(body);
    };
    return Requester;
}());
exports.Requester = Requester;

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var UIComponent_1 = require("./UIComponent");
/**
 * Create the HTML base elements
 * scheduling the UI changes in batch.
 */
var UI = /** @class */ (function () {
    /**
     * Initialize the batch changes.
     */
    function UI() {
        this._changes = [];
        this._applyChanges();
    }
    /**
     * Adds a ui change on queue.
     * @param action
     */
    UI.prototype.addChange = function (action) {
        this._changes.push(action);
        return this;
    };
    /**
     * Applies the ui change
     */
    UI.prototype._applyChanges = function () {
        var _this = this;
        while (this._changes.length > 0) {
            this._changes.shift()();
        }
        window.requestAnimationFrame(function (time) {
            _this._applyChanges();
        });
        return this;
    };
    UI.prototype.div = function () {
        return new UIComponent_1.UIComponent('div', this);
    };
    UI.prototype.span = function () {
        return new UIComponent_1.UIComponent('span', this);
    };
    UI.prototype.h2 = function () {
        return new UIComponent_1.UIComponent('h2', this);
    };
    UI.prototype.section = function () {
        return new UIComponent_1.UIComponent('section', this);
    };
    UI.prototype.aside = function () {
        return new UIComponent_1.UIComponent('aside', this);
    };
    UI.prototype.p = function () {
        return new UIComponent_1.UIComponent('p', this);
    };
    UI.prototype.ul = function () {
        return new UIComponent_1.UIComponent('ul', this);
    };
    UI.prototype.li = function () {
        return new UIComponent_1.UIComponent('li', this);
    };
    UI.prototype.a = function () {
        return new UIComponent_1.UIComponent('a', this);
    };
    UI.prototype.button = function () {
        return new UIComponent_1.UIComponent('button', this);
    };
    UI.prototype.input = function () {
        return new UIComponent_1.UIComponent('input', this);
    };
    UI.prototype.label = function () {
        return new UIComponent_1.UIComponent('label', this);
    };
    return UI;
}());
exports.UI = UI;

},{"./UIComponent":4}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Classe base for all components with standard
 * way to add UI changes in batch.
 */
var UIComponent = /** @class */ (function () {
    function UIComponent(tag, up) {
        var _this = this;
        this._up = up;
        this._element = null;
        this._up.addChange(function () {
            _this._element = document.createElement(tag);
        });
    }
    /**
     * Adds an UI change using the enclose
     * element of this component.
     * @param action IU change
     */
    UIComponent.prototype.addChange = function (action) {
        var _this = this;
        this._up.addChange(function () {
            action(_this._element);
        });
        return this;
    };
    /**
     * Adds a event listener for click.
     * @param fn
     */
    UIComponent.prototype.click = function (fn) {
        this.addChange(function (e) {
            e.addEventListener("click", function () {
                fn();
            });
        });
        return this;
    };
    /**
     * Change the textContent attribute
     * of the element.
     * @param value textContent
     */
    UIComponent.prototype.text = function (value) {
        this.addChange(function (e) {
            e.textContent = value;
        });
        return this;
    };
    /**
     * Appends other component within this.
     * @param c component
     */
    UIComponent.prototype.add = function (c) {
        this.addChange(function (e) {
            c.addChange(function (ce) {
                e.appendChild(ce);
            });
        });
        return this;
    };
    /**
     * Remove all elements contained
     * in this component.
     */
    UIComponent.prototype.clear = function () {
        this.addChange(function (e) {
            while (e.childNodes.length > 0) {
                e.removeChild(e.firstChild);
            }
        });
    };
    /**
     * Appends a style class name a
     * classList of the element.
     * @param value an class name
     */
    UIComponent.prototype.className = function (value) {
        var v = value;
        this.addChange(function (e) {
            e.classList.add(v);
        });
        return this;
    };
    return UIComponent;
}());
exports.UIComponent = UIComponent;

},{}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var UI_1 = require("./UI");
var UIXButton_1 = require("./UIXButton");
var UIXField_1 = require("./UIXField");
/**
 * Extended UI with specialized and styled
 * components.
 */
var UIX = /** @class */ (function (_super) {
    __extends(UIX, _super);
    function UIX() {
        return _super.call(this) || this;
    }
    /**
     * Organizes the elements using vertical layout.
     */
    UIX.prototype.vertical = function () {
        return _super.prototype.div.call(this).className('nk-v');
    };
    /**
     * Organizes the elements using horizontal layout.
     */
    UIX.prototype.horizontal = function () {
        return _super.prototype.div.call(this).className('nk-h');
    };
    /**
     * Create a simple text.
     */
    UIX.prototype.text = function (value) {
        return _super.prototype.span.call(this).text(value);
    };
    /**
     * Create a UIXButton component.
     */
    UIX.prototype.button = function () {
        return new UIXButton_1.UIXButton(this).className('nk-btn');
    };
    /**
     * Create a UIXField component.
     */
    UIX.prototype.field = function () {
        return new UIXField_1.UIXField(this).className('nk-fld');
    };
    /**
     * Create a element with relevant to user.
     */
    UIX.prototype.item = function () {
        return _super.prototype.div.call(this).className('nk-i');
    };
    /**
     * Create a region for contain other elements.
     */
    UIX.prototype.box = function () {
        return _super.prototype.div.call(this).className('nk-t');
    };
    /**
     * Aligns the element to left.
     * @param comp internal component.
     */
    UIX.prototype.left = function (comp) {
        return _super.prototype.div.call(this).className('nk-l').add(comp);
    };
    /**
     * Aligns the element to right.
     * @param comp internal component.
     */
    UIX.prototype.right = function (comp) {
        return _super.prototype.div.call(this).className('nk-r').add(comp);
    };
    /**
     * Header title.
     * @param value text
     */
    UIX.prototype.title = function (value) {
        return _super.prototype.h2.call(this).className('nk-hd-t').text(value);
    };
    /**
     * Organize lists.
     */
    UIX.prototype.list = function () {
        return _super.prototype.div.call(this).className('nk-lt');
    };
    /**
     * Item of the list components.
     * @param text Item of list
     */
    UIX.prototype.listItem = function (text) {
        var c = _super.prototype.div.call(this).className('nk-lt-it');
        if (text) {
            c.add(this.text(text));
        }
        return c;
    };
    return UIX;
}(UI_1.UI));
exports.UIX = UIX;

},{"./UI":3,"./UIXButton":6,"./UIXField":7}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var UIComponent_1 = require("./UIComponent");
/**
 * Specialized component button.
 */
var UIXButton = /** @class */ (function (_super) {
    __extends(UIXButton, _super);
    function UIXButton(up) {
        var _this = _super.call(this, 'button', up) || this;
        _this.addChange(function (e) {
            e.setAttribute("data-nk-btn", "normal");
        });
        return _this;
    }
    /**
     * Primary action for user.
     */
    UIXButton.prototype.primary = function () {
        this.addChange(function (e) {
            e.setAttribute("data-nk-btn", "primary");
        });
        return this;
    };
    /**
     * Secundary action for user
     */
    UIXButton.prototype.link = function () {
        this.addChange(function (e) {
            e.setAttribute("data-nk-btn", "link");
        });
        return this;
    };
    return UIXButton;
}(UIComponent_1.UIComponent));
exports.UIXButton = UIXButton;

},{"./UIComponent":4}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var UIComponent_1 = require("./UIComponent");
/**
 * A label, input and span for messages.
 */
var UIXField = /** @class */ (function (_super) {
    __extends(UIXField, _super);
    function UIXField(ui) {
        var _this = _super.call(this, 'div', ui) || this;
        _super.prototype.className.call(_this, 'nk-fld');
        _this._label = ui.label();
        _this._input = ui.input();
        _this._span = ui.span();
        _super.prototype.add.call(_this, _this._label);
        _super.prototype.add.call(_this, _this._input);
        _super.prototype.add.call(_this, _this._span);
        return _this;
    }
    /**
     * Name of the field.
     * @param value
     */
    UIXField.prototype.label = function (value) {
        this._label.text(value);
        return this;
    };
    /**
     * Placeholder of th field.
     * @param value
     */
    UIXField.prototype.hint = function (value) {
        this._input.addChange(function (e) {
            e.placeholder = value;
        });
        return this;
    };
    /**
     * info message.
     */
    UIXField.prototype.msg = function (value) {
        this.addChange(function (e) {
            e.classList.add('nk-fld-m');
        });
        this._span.addChange(function (e) {
            e.textContent = value;
        });
        return this;
    };
    /**
     * invalid input
     */
    UIXField.prototype.invalid = function (value) {
        if (!value || value == '') {
            this.addChange(function (e) {
                e.classList.remove('nk-fld-iv');
            });
            this._span.addChange(function (e) {
                e.textContent = '';
            });
        }
        else {
            this.addChange(function (e) {
                e.classList.add('nk-fld-iv');
            });
            this._span.addChange(function (e) {
                e.textContent = value;
            });
        }
        return this;
    };
    /**
     * changes the value of the input.
     * @param v value to change.
     */
    UIXField.prototype.valued = function (v) {
        this._input.addChange(function (e) {
            e.value = v;
        });
        return this;
    };
    /**
     * returns the value of input.
     */
    UIXField.prototype.value = function () {
        return this._input._element.value;
    };
    /**
     * define the input type for password.
     */
    UIXField.prototype.password = function () {
        this._input.addChange(function (e) {
            e.type = 'password';
        });
        return this;
    };
    /**
     * Adds event onchange on input.
     * @param fn action function
     */
    UIXField.prototype.onChange = function (fn) {
        var _this = this;
        this.addChange(function (e) {
            e.onchange = function (event) {
                fn(_this._input._element.value);
            };
        });
        return this;
    };
    /**
     * Adds event keydown on input.
     * @param fn
     */
    UIXField.prototype.onKey = function (fn) {
        var _this = this;
        this.addChange(function (e) {
            e.onkeydown = function (event) {
                fn(_this._input._element.value);
            };
        });
        return this;
    };
    return UIXField;
}(UIComponent_1.UIComponent));
exports.UIXField = UIXField;

},{"./UIComponent":4}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Manages visible and hidden views components
 * using browser history.
 */
var ViewManager = /** @class */ (function () {
    /**
     * Create the view manager.
     * @param selector selector for root element
     * @param ui ui factory
     */
    function ViewManager(selector, ui) {
        var _this = this;
        this._ui = ui;
        this._root = document.querySelector(selector);
        this._stack = [];
        window.onpopstate = function () { return _this.pop(); };
    }
    /**
     * Create a visible component and hidden stack components.
     * @param factory factory to component
     */
    ViewManager.prototype.open = function (factory) {
        var _this = this;
        this._ui.addChange(function () {
            var element = document.createElement("div");
            element.className = "nk-vw";
            var closeFn = function () {
                var pos = _this._stack.lastIndexOf(element);
                if (pos > -1) {
                    _this._stack.splice(pos, 1);
                }
                _this._setVisible(element, false);
                _this._root.removeChild(element);
                if (_this._stack.length > 0) {
                    _this._setVisible(_this._stack[_this._stack.length - 1], true);
                }
            };
            var component = factory(closeFn);
            component.addChange(function (e) {
                element.appendChild(e);
                _this._root.appendChild(document.createDocumentFragment().appendChild(element));
                if (_this._stack.length > 0) {
                    _this._setVisible(_this._stack[_this._stack.length - 1], false);
                }
                _this._stack.push(element);
                _this._setVisible(element, true);
                history.pushState({}, "", "/");
            });
        });
    };
    /**
     * Remove the top view visible and
     * show the bottom hidden component.
     */
    ViewManager.prototype.pop = function () {
        if (this._stack.length > 0) {
            var element = this._stack.pop();
            this._setVisible(element, false);
            this._root.removeChild(element);
            if (this._stack.length > 0) {
                this._setVisible(this._stack[this._stack.length - 1], true);
            }
        }
    };
    /**
     * Change the visible component.
     */
    ViewManager.prototype._setVisible = function (e, visible) {
        var cssVisible = 'nk-vw-ac';
        var cssNoVisible = 'nk-vw-in';
        if (visible) {
            e.classList.remove(cssNoVisible);
            e.classList.add(cssVisible);
        }
        else {
            e.classList.remove(cssVisible);
            e.classList.add(cssNoVisible);
        }
    };
    return ViewManager;
}());
exports.ViewManager = ViewManager;

},{}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var dist_1 = require("@naskar/nkui/dist");
var dist_2 = require("@naskar/nkui/dist");
var ui = new dist_1.UIX();
var vm = new dist_2.ViewManager('.nk-app', ui);
var username = ui.field().label('Username');
var password = ui.field().label('Password').password();
var view = ui.item().add(ui.vertical()
    .add(ui.title("nkui-sample"))
    .add(username)
    .add(password)
    .add(ui.box())
    .add(ui.button().primary().text('Login').click(function () {
    username.msg("Hello " + username.value());
})));
vm.open(function (close) { return view; });

},{"@naskar/nkui/dist":1}]},{},[9]);
