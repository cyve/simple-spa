/*!
 * SimpleSpa v1.0.0
 * Copyright Cyril Vermande
 * Licensed under the MIT license
 */
var SimpleSpa = {
    pageContentSelector: '#content',
    get: function(href) {
        var _this = this;
        this.showLoadingFavicon();

        return fetch(href).then(function (response) {
            return response.text();
        }).then(function (html) {
            return _this.loadContent(html);
        });
    },
    post: function(form) {
        var _this = this;
        this.showLoadingFavicon();

        return fetch(form.action, { method: 'post', body: new FormData(form) }).then(function (response) {
            return response.text();
        }).then(function (html) {
            return _this.loadContent(html);
        });
    },
    loadContent: function (html) {
        var _this = this;
        this.resetFavicon();

        return new Promise((success, failure) => {
            try {
                window.scrollTo(0,0);

                var newDocument = document.implementation.createHTMLDocument('New document');
                    newDocument.documentElement.innerHTML = html.trim();
                var newContentElement = newDocument.querySelector(_this.pageContentSelector) || newDocument.querySelector('body'),
                    newTitleElement = newDocument.querySelector('title') || document.createElement('title');

                document.querySelector(_this.pageContentSelector).innerHTML = newContentElement.innerHTML;
                document.title = newTitleElement.innerText;

                var scriptNodes = document.querySelectorAll(_this.pageContentSelector + ' script').forEach(function (node) {
                    eval(node.innerText);
                });

                if (_this.onContentLoaded) {
                    _this.onContentLoaded.call(_this);
                }

                success();
            } catch (error) {
                failure(error);
            }
        });
    },
    defaultFavicon: null,
    showLoadingFavicon: function () {
        var favicon = document.querySelector('link[rel*="icon"]');
        if (!favicon) {
            favicon = document.createElement('link')
            favicon.rel = 'icon'
            favicon.href = '/favicon.ico';
            document.head.appendChild(favicon);
        }
        if (!this.defaultFavicon) {
            this.defaultFavicon = favicon.href
        }

        favicon.href = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNjY2NjY2IiBmaWxsLW9wYWNpdHk9IjEiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGQ9Ik02My44NSAwQTYzLjg1IDYzLjg1IDAgMSAxIDAgNjMuODUgNjMuODUgNjMuODUgMCAwIDEgNjMuODUgMHptLjY1IDE5LjVhNDQgNDQgMCAxIDEtNDQgNDQgNDQgNDQgMCAwIDEgNDQtNDR6IiBmaWxsPSJ1cmwoI2xpbmVhci1ncmFkaWVudCkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBmcm9tPSIwIDY0IDY0IiB0bz0iMzYwIDY0IDY0IiBkdXI9IjEwODBtcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L2c+PC9zdmc+';
    },
    resetFavicon: function () {
        var favicon = document.querySelector('link[rel*="icon"]');
        if (favicon && this.defaultFavicon) {
            favicon.href = this.defaultFavicon;
        }
    },
    onPopState: function(e) {
        if (e.target.location.origin !== window.location.origin || e.target.location.href.match(/#/)) {
            return;
        }

        e.preventDefault();
        SimpleSpa.get(e.target.location.href);
    },
    onClick: function(e) {
        for (var target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches('a')) {
                var a = target;
                if (a.origin !== window.location.origin || a.target === '_blank' || a.href.match(/#/)) {
                    return;
                }

                e.preventDefault();
                SimpleSpa.get(a.href).then(function () {
                    window.history.pushState(null, document.title , a.href);
                });
                break;
            }
        }
    },
    onSubmit: function(e) {
        for (var target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches('form')) {
                var form = target;
                if (!form.action) {
                    form.action = window.location.href
                }

                if (!form.action.startsWith(window.location.origin) || form.target === '_blank') {
                    return;
                }

                e.preventDefault();
                if (form.method === 'get') {
                    var urlSearchParams = new URLSearchParams();
                    for (var i=0,l=form.length; i<l; i++) {
                        if (form[i].name) {
                            urlSearchParams.append(form[i].name, form[i].value);
                        }
                    }
                    form.action += '?' + urlSearchParams.toString();

                    var promise = SimpleSpa.get(form.action);
                } else {
                    var promise = SimpleSpa.post(form);
                }

                promise.then(function () {
                    window.history.pushState(null, document.title , form.action);
                });
                break;
            }
        }
    }
};

/* Check browser compatibility and init event listeners */
if (window.fetch && window.FormData && window.history.pushState) {
    window.addEventListener('popstate', SimpleSpa.onPopState);
    document.addEventListener('click', SimpleSpa.onClick);
    document.addEventListener('submit', SimpleSpa.onSubmit);
}
