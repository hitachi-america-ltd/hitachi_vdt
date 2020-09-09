/*
fraction.js
A Javascript fraction library.

Copyright (c) 2009  Erik Garrison <erik@hypervolu.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
Fraction = function(e, t) {
	if (e && t) "number" == typeof e && "number" == typeof t ? (this.numerator = e, this.denominator = t) : "string" == typeof e && "string" == typeof t && (this.numerator = parseInt(e), this.denominator = parseInt(t));
	else if (!t)
		if (num = e, "number" == typeof num) this.numerator = num, this.denominator = 1;
		else if ("string" == typeof num) {
		var n, i, o = num.split(" ");
		if (n = o[0], i = o[1], n % 1 === 0 && i && i.match("/")) return new Fraction(n).add(new Fraction(i));
		if (!n || i) return void 0;
		if ("string" == typeof n && n.match("/")) {
			var r = n.split("/");
			this.numerator = r[0], this.denominator = r[1]
		} else {
			if ("string" == typeof n && n.match(".")) return new Fraction(parseFloat(n));
			this.numerator = parseInt(n), this.denominator = 1
		}
	}
	this.normalize()
}, Fraction.prototype.clone = function() {
	return new Fraction(this.numerator, this.denominator)
}, Fraction.prototype.toString = function() {
	var e = Math.floor(this.numerator / this.denominator),
		t = this.numerator % this.denominator,
		n = this.denominator,
		i = [];
	return 0 != e && i.push(e), 0 != t && i.push(t + "/" + n), i.length > 0 ? i.join(" ") : 0
}, Fraction.prototype.rescale = function(e) {
	return this.numerator *= e, this.denominator *= e, this
}, Fraction.prototype.add = function(e) {
	var t = this.clone();
	return e = e instanceof Fraction ? e.clone() : new Fraction(e), td = t.denominator, t.rescale(e.denominator), e.rescale(td), t.numerator += e.numerator, t.normalize()
}, Fraction.prototype.subtract = function(e) {
	var t = this.clone();
	return e = e instanceof Fraction ? e.clone() : new Fraction(e), td = t.denominator, t.rescale(e.denominator), e.rescale(td), t.numerator -= e.numerator, t.normalize()
}, Fraction.prototype.multiply = function(e) {
	var t = this.clone();
	if (e instanceof Fraction) t.numerator *= e.numerator, t.denominator *= e.denominator;
	else {
		if ("number" != typeof e) return t.multiply(new Fraction(e));
		t.numerator *= e
	}
	return t.normalize()
}, Fraction.prototype.divide = function(e) {
	var t = this.clone();
	if (e instanceof Fraction) t.numerator /= e.numerator, t.denominator /= e.denominator;
	else {
		if ("number" != typeof e) return t.divide(new Fraction(e));
		t.numerator /= e
	}
	return t.normalize()
}, Fraction.prototype.equals = function(e) {
	e instanceof Fraction || (e = new Fraction(e));
	var t = this.clone().normalize(),
		e = e.clone().normalize();
	return t.numerator === e.numerator && t.denominator === e.denominator
}, Fraction.prototype.normalize = function() {
	var e = function(e) {
			return "number" == typeof e && (e > 0 && e % 1 > 0 && 1 > e % 1 || 0 > e && 0 > e % -1 && e % -1 > -1)
		},
		t = function(e, t) {
			if (t) {
				var n = Math.pow(10, t);
				return Math.round(e * n) / n
			}
			return Math.round(e)
		};
	return function() {
		if (e(this.denominator)) {
			var n = t(this.denominator, 9),
				i = Math.pow(10, n.toString().split(".")[1].length);
			this.denominator = Math.round(this.denominator * i), this.numerator *= i
		}
		if (e(this.numerator)) {
			var n = t(this.numerator, 9),
				i = Math.pow(10, n.toString().split(".")[1].length);
			this.numerator = Math.round(this.numerator * i), this.denominator *= i
		}
		var o = Fraction.gcf(this.numerator, this.denominator);
		return this.numerator /= o, this.denominator /= o, this
	}
}(), Fraction.gcf = function(e, t) {
	var n = [],
		i = Fraction.primeFactors(e),
		o = Fraction.primeFactors(t);
	if (i.forEach(function(e) {
			var t = o.indexOf(e);
			t >= 0 && (n.push(e), o.splice(t, 1))
		}), 0 === n.length) return 1;
	var r = function() {
		var e, t = n[0];
		for (e = 1; e < n.length; e++) t *= n[e];
		return t
	}();
	return r
}, Fraction.primeFactors = function(e) {
	for (var t = e, n = [], i = 2; t >= i * i;) t % i === 0 ? (n.push(i), t /= i) : i++;
	return 1 != t && n.push(t), n
},
function() {
	! function(e) {
		var t = this || (0, eval)("this"),
			n = t.document,
			i = t.navigator,
			o = t.jQuery,
			r = t.JSON;
		! function(e) {
			"function" == typeof require && "object" == typeof exports && "object" == typeof module ? e(module.exports || exports, require) : "function" == typeof define && define.amd ? define(["exports", "require"], e) : e(t.ko = {})
		}(function(a, s) {
			function l(e, t) {
				return null === e || typeof e in d ? e === t : !1
			}

			function c(t, n) {
				var i;
				return function() {
					i || (i = setTimeout(function() {
						i = e, t()
					}, n))
				}
			}

			function u(e, t) {
				var n;
				return function() {
					clearTimeout(n), n = setTimeout(e, t)
				}
			}

			function h(e, t, n, i) {
				p.d[e] = {
					init: function(e, o, r, a, s) {
						var l, c;
						return p.s(function() {
							var r = p.a.c(o()),
								a = !n != !r,
								u = !c;
							(u || t || a !== l) && (u && p.Y.la() && (c = p.a.ia(p.f.childNodes(e), !0)), a ? (u || p.f.T(e, p.a.ia(c)), p.Ca(i ? i(s, r) : s, e)) : p.f.ja(e), l = a)
						}, null, {
							o: e
						}), {
							controlsDescendantBindings: !0
						}
					}
				}, p.h.ha[e] = !1, p.f.Q[e] = !0
			}
			var p = "undefined" != typeof a ? a : {};
			p.b = function(e, t) {
					for (var n = e.split("."), i = p, o = 0; o < n.length - 1; o++) i = i[n[o]];
					i[n[n.length - 1]] = t
				}, p.A = function(e, t, n) {
					e[t] = n
				}, p.version = "3.2.0", p.b("version", p.version), p.a = function() {
					function a(e, t) {
						for (var n in e) e.hasOwnProperty(n) && t(n, e[n])
					}

					function s(e, t) {
						if (t)
							for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
						return e
					}

					function l(e, t) {
						return e.__proto__ = t, e
					}
					var c = {
						__proto__: []
					}
					instanceof Array, u = {}, h = {};
					u[i && /Firefox\/2/i.test(i.userAgent) ? "KeyboardEvent" : "UIEvents"] = ["keyup", "keydown", "keypress"], u.MouseEvents = "click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" "), a(u, function(e, t) {
						if (t.length)
							for (var n = 0, i = t.length; i > n; n++) h[t[n]] = e
					});
					var d = {
							propertychange: !0
						},
						f = n && function() {
							for (var t = 3, i = n.createElement("div"), o = i.getElementsByTagName("i"); i.innerHTML = "<!--[if gt IE " + ++t + "]><i></i><![endif]-->", o[0];);
							return t > 4 ? t : e
						}();
					return {
						vb: ["authenticity_token", /^__RequestVerificationToken(_.*)?$/],
						u: function(e, t) {
							for (var n = 0, i = e.length; i > n; n++) t(e[n], n)
						},
						m: function(e, t) {
							if ("function" == typeof Array.prototype.indexOf) return Array.prototype.indexOf.call(e, t);
							for (var n = 0, i = e.length; i > n; n++)
								if (e[n] === t) return n;
							return -1
						},
						qb: function(e, t, n) {
							for (var i = 0, o = e.length; o > i; i++)
								if (t.call(n, e[i], i)) return e[i];
							return null
						},
						ua: function(e, t) {
							var n = p.a.m(e, t);
							n > 0 ? e.splice(n, 1) : 0 === n && e.shift()
						},
						rb: function(e) {
							e = e || [];
							for (var t = [], n = 0, i = e.length; i > n; n++) 0 > p.a.m(t, e[n]) && t.push(e[n]);
							return t
						},
						Da: function(e, t) {
							e = e || [];
							for (var n = [], i = 0, o = e.length; o > i; i++) n.push(t(e[i], i));
							return n
						},
						ta: function(e, t) {
							e = e || [];
							for (var n = [], i = 0, o = e.length; o > i; i++) t(e[i], i) && n.push(e[i]);
							return n
						},
						ga: function(e, t) {
							if (t instanceof Array) e.push.apply(e, t);
							else
								for (var n = 0, i = t.length; i > n; n++) e.push(t[n]);
							return e
						},
						ea: function(e, t, n) {
							var i = p.a.m(p.a.Xa(e), t);
							0 > i ? n && e.push(t) : n || e.splice(i, 1)
						},
						xa: c,
						extend: s,
						za: l,
						Aa: c ? l : s,
						G: a,
						na: function(e, t) {
							if (!e) return e;
							var n, i = {};
							for (n in e) e.hasOwnProperty(n) && (i[n] = t(e[n], n, e));
							return i
						},
						Ka: function(e) {
							for (; e.firstChild;) p.removeNode(e.firstChild)
						},
						oc: function(e) {
							e = p.a.S(e);
							for (var t = n.createElement("div"), i = 0, o = e.length; o > i; i++) t.appendChild(p.R(e[i]));
							return t
						},
						ia: function(e, t) {
							for (var n = 0, i = e.length, o = []; i > n; n++) {
								var r = e[n].cloneNode(!0);
								o.push(t ? p.R(r) : r)
							}
							return o
						},
						T: function(e, t) {
							if (p.a.Ka(e), t)
								for (var n = 0, i = t.length; i > n; n++) e.appendChild(t[n])
						},
						Lb: function(e, t) {
							var n = e.nodeType ? [e] : e;
							if (0 < n.length) {
								for (var i = n[0], o = i.parentNode, r = 0, a = t.length; a > r; r++) o.insertBefore(t[r], i);
								for (r = 0, a = n.length; a > r; r++) p.removeNode(n[r])
							}
						},
						ka: function(e, t) {
							if (e.length) {
								for (t = 8 === t.nodeType && t.parentNode || t; e.length && e[0].parentNode !== t;) e.shift();
								if (1 < e.length) {
									var n = e[0],
										i = e[e.length - 1];
									for (e.length = 0; n !== i;)
										if (e.push(n), n = n.nextSibling, !n) return;
									e.push(i)
								}
							}
							return e
						},
						Nb: function(e, t) {
							7 > f ? e.setAttribute("selected", t) : e.selected = t
						},
						cb: function(t) {
							return null === t || t === e ? "" : t.trim ? t.trim() : t.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
						},
						vc: function(e, t) {
							return e = e || "", t.length > e.length ? !1 : e.substring(0, t.length) === t
						},
						cc: function(e, t) {
							if (e === t) return !0;
							if (11 === e.nodeType) return !1;
							if (t.contains) return t.contains(3 === e.nodeType ? e.parentNode : e);
							if (t.compareDocumentPosition) return 16 == (16 & t.compareDocumentPosition(e));
							for (; e && e != t;) e = e.parentNode;
							return !!e
						},
						Ja: function(e) {
							return p.a.cc(e, e.ownerDocument.documentElement)
						},
						ob: function(e) {
							return !!p.a.qb(e, p.a.Ja)
						},
						t: function(e) {
							return e && e.tagName && e.tagName.toLowerCase()
						},
						n: function(e, t, n) {
							var i = f && d[t];
							if (!i && o) o(e).bind(t, n);
							else if (i || "function" != typeof e.addEventListener) {
								if ("undefined" == typeof e.attachEvent) throw Error("Browser doesn't support addEventListener or attachEvent");
								var r = function(t) {
										n.call(e, t)
									},
									a = "on" + t;
								e.attachEvent(a, r), p.a.w.da(e, function() {
									e.detachEvent(a, r)
								})
							} else e.addEventListener(t, n, !1)
						},
						oa: function(e, i) {
							if (!e || !e.nodeType) throw Error("element must be a DOM node when calling triggerEvent");
							var r;
							if ("input" === p.a.t(e) && e.type && "click" == i.toLowerCase() ? (r = e.type, r = "checkbox" == r || "radio" == r) : r = !1, o && !r) o(e).trigger(i);
							else if ("function" == typeof n.createEvent) {
								if ("function" != typeof e.dispatchEvent) throw Error("The supplied element doesn't support dispatchEvent");
								r = n.createEvent(h[i] || "HTMLEvents"), r.initEvent(i, !0, !0, t, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, e), e.dispatchEvent(r)
							} else if (r && e.click) e.click();
							else {
								if ("undefined" == typeof e.fireEvent) throw Error("Browser doesn't support triggering events");
								e.fireEvent("on" + i)
							}
						},
						c: function(e) {
							return p.C(e) ? e() : e
						},
						Xa: function(e) {
							return p.C(e) ? e.v() : e
						},
						Ba: function(e, t, n) {
							if (t) {
								var i = /\S+/g,
									o = e.className.match(i) || [];
								p.a.u(t.match(i), function(e) {
									p.a.ea(o, e, n)
								}), e.className = o.join(" ")
							}
						},
						bb: function(t, n) {
							var i = p.a.c(n);
							(null === i || i === e) && (i = "");
							var o = p.f.firstChild(t);
							!o || 3 != o.nodeType || p.f.nextSibling(o) ? p.f.T(t, [t.ownerDocument.createTextNode(i)]) : o.data = i, p.a.fc(t)
						},
						Mb: function(e, t) {
							if (e.name = t, 7 >= f) try {
								e.mergeAttributes(n.createElement("<input name='" + e.name + "'/>"), !1)
							} catch (i) {}
						},
						fc: function(e) {
							f >= 9 && (e = 1 == e.nodeType ? e : e.parentNode, e.style && (e.style.zoom = e.style.zoom))
						},
						dc: function(e) {
							if (f) {
								var t = e.style.width;
								e.style.width = 0, e.style.width = t
							}
						},
						sc: function(e, t) {
							e = p.a.c(e), t = p.a.c(t);
							for (var n = [], i = e; t >= i; i++) n.push(i);
							return n
						},
						S: function(e) {
							for (var t = [], n = 0, i = e.length; i > n; n++) t.push(e[n]);
							return t
						},
						yc: 6 === f,
						zc: 7 === f,
						L: f,
						xb: function(e, t) {
							for (var n = p.a.S(e.getElementsByTagName("input")).concat(p.a.S(e.getElementsByTagName("textarea"))), i = "string" == typeof t ? function(e) {
									return e.name === t
								} : function(e) {
									return t.test(e.name)
								}, o = [], r = n.length - 1; r >= 0; r--) i(n[r]) && o.push(n[r]);
							return o
						},
						pc: function(e) {
							return "string" == typeof e && (e = p.a.cb(e)) ? r && r.parse ? r.parse(e) : new Function("return " + e)() : null
						},
						eb: function(e, t, n) {
							if (!r || !r.stringify) throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
							return r.stringify(p.a.c(e), t, n)
						},
						qc: function(e, t, i) {
							i = i || {};
							var o = i.params || {},
								r = i.includeFields || this.vb,
								s = e;
							if ("object" == typeof e && "form" === p.a.t(e))
								for (var s = e.action, l = r.length - 1; l >= 0; l--)
									for (var c = p.a.xb(e, r[l]), u = c.length - 1; u >= 0; u--) o[c[u].name] = c[u].value;
							t = p.a.c(t);
							var h = n.createElement("form");
							h.style.display = "none", h.action = s, h.method = "post";
							for (var d in t) e = n.createElement("input"), e.type = "hidden", e.name = d, e.value = p.a.eb(p.a.c(t[d])), h.appendChild(e);
							a(o, function(e, t) {
								var i = n.createElement("input");
								i.type = "hidden", i.name = e, i.value = t, h.appendChild(i)
							}), n.body.appendChild(h), i.submitter ? i.submitter(h) : h.submit(), setTimeout(function() {
								h.parentNode.removeChild(h)
							}, 0)
						}
					}
				}(), p.b("utils", p.a), p.b("utils.arrayForEach", p.a.u), p.b("utils.arrayFirst", p.a.qb), p.b("utils.arrayFilter", p.a.ta), p.b("utils.arrayGetDistinctValues", p.a.rb), p.b("utils.arrayIndexOf", p.a.m), p.b("utils.arrayMap", p.a.Da), p.b("utils.arrayPushAll", p.a.ga), p.b("utils.arrayRemoveItem", p.a.ua), p.b("utils.extend", p.a.extend), p.b("utils.fieldsIncludedWithJsonPost", p.a.vb), p.b("utils.getFormFields", p.a.xb), p.b("utils.peekObservable", p.a.Xa), p.b("utils.postJson", p.a.qc), p.b("utils.parseJson", p.a.pc), p.b("utils.registerEventHandler", p.a.n), p.b("utils.stringifyJson", p.a.eb), p.b("utils.range", p.a.sc), p.b("utils.toggleDomNodeCssClass", p.a.Ba), p.b("utils.triggerEvent", p.a.oa), p.b("utils.unwrapObservable", p.a.c), p.b("utils.objectForEach", p.a.G), p.b("utils.addOrRemoveItem", p.a.ea), p.b("unwrap", p.a.c), Function.prototype.bind || (Function.prototype.bind = function(e) {
					var t = this,
						n = Array.prototype.slice.call(arguments);
					return e = n.shift(),
						function() {
							return t.apply(e, n.concat(Array.prototype.slice.call(arguments)))
						}
				}), p.a.e = new function() {
					function t(t, r) {
						var a = t[i];
						if (!a || "null" === a || !o[a]) {
							if (!r) return e;
							a = t[i] = "ko" + n++, o[a] = {}
						}
						return o[a]
					}
					var n = 0,
						i = "__ko__" + (new Date).getTime(),
						o = {};
					return {
						get: function(n, i) {
							var o = t(n, !1);
							return o === e ? e : o[i]
						},
						set: function(n, i, o) {
							(o !== e || t(n, !1) !== e) && (t(n, !0)[i] = o)
						},
						clear: function(e) {
							var t = e[i];
							return t ? (delete o[t], e[i] = null, !0) : !1
						},
						F: function() {
							return n++ + i
						}
					}
				}, p.b("utils.domData", p.a.e), p.b("utils.domData.clear", p.a.e.clear), p.a.w = new function() {
					function t(t, n) {
						var o = p.a.e.get(t, i);
						return o === e && n && (o = [], p.a.e.set(t, i, o)), o
					}

					function n(e) {
						var i = t(e, !1);
						if (i)
							for (var i = i.slice(0), o = 0; o < i.length; o++) i[o](e);
						if (p.a.e.clear(e), p.a.w.cleanExternalData(e), a[e.nodeType])
							for (i = e.firstChild; e = i;) i = e.nextSibling, 8 === e.nodeType && n(e)
					}
					var i = p.a.e.F(),
						r = {
							1: !0,
							8: !0,
							9: !0
						},
						a = {
							1: !0,
							9: !0
						};
					return {
						da: function(e, n) {
							if ("function" != typeof n) throw Error("Callback must be a function");
							t(e, !0).push(n)
						},
						Kb: function(n, o) {
							var r = t(n, !1);
							r && (p.a.ua(r, o), 0 == r.length && p.a.e.set(n, i, e))
						},
						R: function(e) {
							if (r[e.nodeType] && (n(e), a[e.nodeType])) {
								var t = [];
								p.a.ga(t, e.getElementsByTagName("*"));
								for (var i = 0, o = t.length; o > i; i++) n(t[i])
							}
							return e
						},
						removeNode: function(e) {
							p.R(e), e.parentNode && e.parentNode.removeChild(e)
						},
						cleanExternalData: function(e) {
							o && "function" == typeof o.cleanData && o.cleanData([e])
						}
					}
				}, p.R = p.a.w.R, p.removeNode = p.a.w.removeNode, p.b("cleanNode", p.R), p.b("removeNode", p.removeNode), p.b("utils.domNodeDisposal", p.a.w), p.b("utils.domNodeDisposal.addDisposeCallback", p.a.w.da), p.b("utils.domNodeDisposal.removeDisposeCallback", p.a.w.Kb),
				function() {
					p.a.ba = function(e) {
						var i;
						if (o) {
							if (o.parseHTML) i = o.parseHTML(e) || [];
							else if ((i = o.clean([e])) && i[0]) {
								for (e = i[0]; e.parentNode && 11 !== e.parentNode.nodeType;) e = e.parentNode;
								e.parentNode && e.parentNode.removeChild(e)
							}
						} else {
							var r = p.a.cb(e).toLowerCase();
							for (i = n.createElement("div"), r = r.match(/^<(thead|tbody|tfoot)/) && [1, "<table>", "</table>"] || !r.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!r.indexOf("<td") || !r.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || [0, "", ""], e = "ignored<div>" + r[1] + e + r[2] + "</div>", "function" == typeof t.innerShiv ? i.appendChild(t.innerShiv(e)) : i.innerHTML = e; r[0]--;) i = i.lastChild;
							i = p.a.S(i.lastChild.childNodes)
						}
						return i
					}, p.a.$a = function(t, n) {
						if (p.a.Ka(t), n = p.a.c(n), null !== n && n !== e)
							if ("string" != typeof n && (n = n.toString()), o) o(t).html(n);
							else
								for (var i = p.a.ba(n), r = 0; r < i.length; r++) t.appendChild(i[r])
					}
				}(), p.b("utils.parseHtmlFragment", p.a.ba), p.b("utils.setHtml", p.a.$a), p.D = function() {
					function t(e, n) {
						if (e)
							if (8 == e.nodeType) {
								var i = p.D.Gb(e.nodeValue);
								null != i && n.push({
									bc: e,
									mc: i
								})
							} else if (1 == e.nodeType)
							for (var i = 0, o = e.childNodes, r = o.length; r > i; i++) t(o[i], n)
					}
					var n = {};
					return {
						Ua: function(e) {
							if ("function" != typeof e) throw Error("You can only pass a function to ko.memoization.memoize()");
							var t = (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1) + (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1);
							return n[t] = e, "<!--[ko_memo:" + t + "]-->"
						},
						Rb: function(t, i) {
							var o = n[t];
							if (o === e) throw Error("Couldn't find any memo with ID " + t + ". Perhaps it's already been unmemoized.");
							try {
								return o.apply(null, i || []), !0
							} finally {
								delete n[t]
							}
						},
						Sb: function(e, n) {
							var i = [];
							t(e, i);
							for (var o = 0, r = i.length; r > o; o++) {
								var a = i[o].bc,
									s = [a];
								n && p.a.ga(s, n), p.D.Rb(i[o].mc, s), a.nodeValue = "", a.parentNode && a.parentNode.removeChild(a)
							}
						},
						Gb: function(e) {
							return (e = e.match(/^\[ko_memo\:(.*?)\]$/)) ? e[1] : null
						}
					}
				}(), p.b("memoization", p.D), p.b("memoization.memoize", p.D.Ua), p.b("memoization.unmemoize", p.D.Rb), p.b("memoization.parseMemoText", p.D.Gb), p.b("memoization.unmemoizeDomNodeAndDescendants", p.D.Sb), p.La = {
					throttle: function(e, t) {
						e.throttleEvaluation = t;
						var n = null;
						return p.j({
							read: e,
							write: function(i) {
								clearTimeout(n), n = setTimeout(function() {
									e(i)
								}, t)
							}
						})
					},
					rateLimit: function(e, t) {
						var n, i, o;
						"number" == typeof t ? n = t : (n = t.timeout, i = t.method), o = "notifyWhenChangesStop" == i ? u : c, e.Ta(function(e) {
							return o(e, n)
						})
					},
					notify: function(e, t) {
						e.equalityComparer = "always" == t ? null : l
					}
				};
			var d = {
				undefined: 1,
				"boolean": 1,
				number: 1,
				string: 1
			};
			p.b("extenders", p.La), p.Pb = function(e, t, n) {
				this.target = e, this.wa = t, this.ac = n, this.Cb = !1, p.A(this, "dispose", this.K)
			}, p.Pb.prototype.K = function() {
				this.Cb = !0, this.ac()
			}, p.P = function() {
				p.a.Aa(this, p.P.fn), this.M = {}
			};
			var f = "change",
				m = {
					U: function(e, t, n) {
						var i = this;
						n = n || f;
						var o = new p.Pb(i, t ? e.bind(t) : e, function() {
							p.a.ua(i.M[n], o), i.nb && i.nb()
						});
						return i.va && i.va(n), i.M[n] || (i.M[n] = []), i.M[n].push(o), o
					},
					notifySubscribers: function(e, t) {
						if (t = t || f, this.Ab(t)) try {
							p.k.Ea();
							for (var n, i = this.M[t].slice(0), o = 0; n = i[o]; ++o) n.Cb || n.wa(e)
						} finally {
							p.k.end()
						}
					},
					Ta: function(e) {
						var t, n, i, o = this,
							r = p.C(o);
						o.qa || (o.qa = o.notifySubscribers, o.notifySubscribers = function(e, t) {
							t && t !== f ? "beforeChange" === t ? o.kb(e) : o.qa(e, t) : o.lb(e)
						});
						var a = e(function() {
							r && i === o && (i = o()), t = !1, o.Pa(n, i) && o.qa(n = i)
						});
						o.lb = function(e) {
							t = !0, i = e, a()
						}, o.kb = function(e) {
							t || (n = e, o.qa(e, "beforeChange"))
						}
					},
					Ab: function(e) {
						return this.M[e] && this.M[e].length
					},
					yb: function() {
						var e = 0;
						return p.a.G(this.M, function(t, n) {
							e += n.length
						}), e
					},
					Pa: function(e, t) {
						return !this.equalityComparer || !this.equalityComparer(e, t)
					},
					extend: function(e) {
						var t = this;
						return e && p.a.G(e, function(e, n) {
							var i = p.La[e];
							"function" == typeof i && (t = i(t, n) || t)
						}), t
					}
				};
			p.A(m, "subscribe", m.U), p.A(m, "extend", m.extend), p.A(m, "getSubscriptionsCount", m.yb), p.a.xa && p.a.za(m, Function.prototype), p.P.fn = m, p.Db = function(e) {
				return null != e && "function" == typeof e.U && "function" == typeof e.notifySubscribers
			}, p.b("subscribable", p.P), p.b("isSubscribable", p.Db), p.Y = p.k = function() {
				function e(e) {
					i.push(n), n = e
				}

				function t() {
					n = i.pop()
				}
				var n, i = [],
					o = 0;
				return {
					Ea: e,
					end: t,
					Jb: function(e) {
						if (n) {
							if (!p.Db(e)) throw Error("Only subscribable things can act as dependencies");
							n.wa(e, e.Vb || (e.Vb = ++o))
						}
					},
					B: function(n, i, o) {
						try {
							return e(), n.apply(i, o || [])
						} finally {
							t()
						}
					},
					la: function() {
						return n ? n.s.la() : void 0
					},
					ma: function() {
						return n ? n.ma : void 0
					}
				}
			}(), p.b("computedContext", p.Y), p.b("computedContext.getDependenciesCount", p.Y.la), p.b("computedContext.isInitial", p.Y.ma), p.b("computedContext.isSleeping", p.Y.Ac), p.p = function(e) {
				function t() {
					return 0 < arguments.length ? (t.Pa(n, arguments[0]) && (t.X(), n = arguments[0], t.W()), this) : (p.k.Jb(t), n)
				}
				var n = e;
				return p.P.call(t), p.a.Aa(t, p.p.fn), t.v = function() {
					return n
				}, t.W = function() {
					t.notifySubscribers(n)
				}, t.X = function() {
					t.notifySubscribers(n, "beforeChange")
				}, p.A(t, "peek", t.v), p.A(t, "valueHasMutated", t.W), p.A(t, "valueWillMutate", t.X), t
			}, p.p.fn = {
				equalityComparer: l
			};
			var g = p.p.rc = "__ko_proto__";
			p.p.fn[g] = p.p, p.a.xa && p.a.za(p.p.fn, p.P.fn), p.Ma = function(t, n) {
				return null === t || t === e || t[g] === e ? !1 : t[g] === n ? !0 : p.Ma(t[g], n)
			}, p.C = function(e) {
				return p.Ma(e, p.p)
			}, p.Ra = function(e) {
				return "function" == typeof e && e[g] === p.p || "function" == typeof e && e[g] === p.j && e.hc ? !0 : !1
			}, p.b("observable", p.p), p.b("isObservable", p.C), p.b("isWriteableObservable", p.Ra), p.b("isWritableObservable", p.Ra), p.aa = function(e) {
				if (e = e || [], "object" != typeof e || !("length" in e)) throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
				return e = p.p(e), p.a.Aa(e, p.aa.fn), e.extend({
					trackArrayChanges: !0
				})
			}, p.aa.fn = {
				remove: function(e) {
					for (var t = this.v(), n = [], i = "function" != typeof e || p.C(e) ? function(t) {
							return t === e
						} : e, o = 0; o < t.length; o++) {
						var r = t[o];
						i(r) && (0 === n.length && this.X(), n.push(r), t.splice(o, 1), o--)
					}
					return n.length && this.W(), n
				},
				removeAll: function(t) {
					if (t === e) {
						var n = this.v(),
							i = n.slice(0);
						return this.X(), n.splice(0, n.length), this.W(), i
					}
					return t ? this.remove(function(e) {
						return 0 <= p.a.m(t, e)
					}) : []
				},
				destroy: function(e) {
					var t = this.v(),
						n = "function" != typeof e || p.C(e) ? function(t) {
							return t === e
						} : e;
					this.X();
					for (var i = t.length - 1; i >= 0; i--) n(t[i]) && (t[i]._destroy = !0);
					this.W()
				},
				destroyAll: function(t) {
					return t === e ? this.destroy(function() {
						return !0
					}) : t ? this.destroy(function(e) {
						return 0 <= p.a.m(t, e)
					}) : []
				},
				indexOf: function(e) {
					var t = this();
					return p.a.m(t, e)
				},
				replace: function(e, t) {
					var n = this.indexOf(e);
					n >= 0 && (this.X(), this.v()[n] = t, this.W())
				}
			}, p.a.u("pop push reverse shift sort splice unshift".split(" "), function(e) {
				p.aa.fn[e] = function() {
					var t = this.v();
					return this.X(), this.sb(t, e, arguments), t = t[e].apply(t, arguments), this.W(), t
				}
			}), p.a.u(["slice"], function(e) {
				p.aa.fn[e] = function() {
					var t = this();
					return t[e].apply(t, arguments)
				}
			}), p.a.xa && p.a.za(p.aa.fn, p.p.fn), p.b("observableArray", p.aa);
			var v = "arrayChange";
			p.La.trackArrayChanges = function(e) {
					function t() {
						if (!n) {
							n = !0;
							var t = e.notifySubscribers;
							e.notifySubscribers = function(e, n) {
								return n && n !== f || ++o, t.apply(this, arguments)
							};
							var r = [].concat(e.v() || []);
							i = null, e.U(function(t) {
								if (t = [].concat(t || []), e.Ab(v)) {
									var n;
									(!i || o > 1) && (i = p.a.Fa(r, t, {
										sparse: !0
									})), n = i, n.length && e.notifySubscribers(n, v)
								}
								r = t, i = null, o = 0
							})
						}
					}
					if (!e.sb) {
						var n = !1,
							i = null,
							o = 0,
							r = e.U;
						e.U = e.subscribe = function(e, n, i) {
							return i === v && t(), r.apply(this, arguments)
						}, e.sb = function(e, t, r) {
							function a(e, t, n) {
								return s[s.length] = {
									status: e,
									value: t,
									index: n
								}
							}
							if (n && !o) {
								var s = [],
									l = e.length,
									c = r.length,
									u = 0;
								switch (t) {
									case "push":
										u = l;
									case "unshift":
										for (t = 0; c > t; t++) a("added", r[t], u + t);
										break;
									case "pop":
										u = l - 1;
									case "shift":
										l && a("deleted", e[u], u);
										break;
									case "splice":
										t = Math.min(Math.max(0, 0 > r[0] ? l + r[0] : r[0]), l);
										for (var l = 1 === c ? l : Math.min(t + (r[1] || 0), l), c = t + c - 2, u = Math.max(l, c), h = [], d = [], f = 2; u > t; ++t, ++f) l > t && d.push(a("deleted", e[t], t)), c > t && h.push(a("added", r[f], t));
										p.a.wb(d, h);
										break;
									default:
										return
								}
								i = s
							}
						}
					}
				}, p.s = p.j = function(t, n, i) {
					function o() {
						p.a.G(M, function(e, t) {
							t.K()
						}), M = {}
					}

					function r() {
						o(), S = 0, g = !0, d = !1
					}

					function a() {
						var e = l.throttleEvaluation;
						e && e >= 0 ? (clearTimeout(T), T = setTimeout(s, e)) : l.ib ? l.ib() : s()
					}

					function s(t) {
						if (f) {
							if (y) throw Error("A 'pure' computed must not be called recursively")
						} else if (!g) {
							if (C && C()) {
								if (!m) return void k()
							} else m = !1;
							if (f = !0, b) try {
								var i = {};
								p.k.Ea({
									wa: function(e, t) {
										i[t] || (i[t] = 1, ++S)
									},
									s: l,
									ma: e
								}), S = 0, h = v.call(n)
							} finally {
								p.k.end(), f = !1
							} else try {
								var o = M,
									r = S;
								p.k.Ea({
									wa: function(e, t) {
										g || (r && o[t] ? (M[t] = o[t], ++S, delete o[t], --r) : M[t] || (M[t] = e.U(a), ++S))
									},
									s: l,
									ma: y ? e : !S
								}), M = {}, S = 0;
								try {
									var s = n ? v.call(n) : v()
								} finally {
									p.k.end(), r && p.a.G(o, function(e, t) {
										t.K()
									}), d = !1
								}
								l.Pa(h, s) && (l.notifySubscribers(h, "beforeChange"), h = s, !0 !== t && l.notifySubscribers(h))
							} finally {
								f = !1
							}
							S || k()
						}
					}

					function l() {
						if (0 < arguments.length) {
							if ("function" != typeof w) throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
							return w.apply(n, arguments), this
						}
						return p.k.Jb(l), d && s(!0), h
					}

					function c() {
						return d && !S && s(!0), h
					}

					function u() {
						return d || S > 0
					}
					var h, d = !0,
						f = !1,
						m = !1,
						g = !1,
						v = t,
						y = !1,
						b = !1;
					if (v && "object" == typeof v ? (i = v, v = i.read) : (i = i || {}, v || (v = i.read)), "function" != typeof v) throw Error("Pass a function that returns the value of the ko.computed");
					var w = i.write,
						_ = i.disposeWhenNodeIsRemoved || i.o || null,
						x = i.disposeWhen || i.Ia,
						C = x,
						k = r,
						M = {},
						S = 0,
						T = null;
					n || (n = i.owner), p.P.call(l), p.a.Aa(l, p.j.fn), l.v = c, l.la = function() {
						return S
					}, l.hc = "function" == typeof i.write, l.K = function() {
						k()
					}, l.Z = u;
					var E = l.Ta;
					return l.Ta = function(e) {
						E.call(l, e), l.ib = function() {
							l.kb(h), d = !0, l.lb(l)
						}
					}, i.pure ? (b = y = !0, l.va = function() {
						b && (b = !1, s(!0))
					}, l.nb = function() {
						l.yb() || (o(), b = d = !0)
					}) : i.deferEvaluation && (l.va = function() {
						c(), delete l.va
					}), p.A(l, "peek", l.v), p.A(l, "dispose", l.K), p.A(l, "isActive", l.Z), p.A(l, "getDependenciesCount", l.la), _ && (m = !0, _.nodeType && (C = function() {
						return !p.a.Ja(_) || x && x()
					})), b || i.deferEvaluation || s(), _ && u() && _.nodeType && (k = function() {
						p.a.w.Kb(_, k), r()
					}, p.a.w.da(_, k)), l
				}, p.jc = function(e) {
					return p.Ma(e, p.j)
				}, m = p.p.rc, p.j[m] = p.p, p.j.fn = {
					equalityComparer: l
				}, p.j.fn[m] = p.j, p.a.xa && p.a.za(p.j.fn, p.P.fn), p.b("dependentObservable", p.j), p.b("computed", p.j), p.b("isComputed", p.jc), p.Ib = function(e, t) {
					return "function" == typeof e ? p.s(e, t, {
						pure: !0
					}) : (e = p.a.extend({}, e), e.pure = !0, p.s(e, t))
				}, p.b("pureComputed", p.Ib),
				function() {
					function t(o, r, a) {
						if (a = a || new i, o = r(o), "object" != typeof o || null === o || o === e || o instanceof Date || o instanceof String || o instanceof Number || o instanceof Boolean) return o;
						var s = o instanceof Array ? [] : {};
						return a.save(o, s), n(o, function(n) {
							var i = r(o[n]);
							switch (typeof i) {
								case "boolean":
								case "number":
								case "string":
								case "function":
									s[n] = i;
									break;
								case "object":
								case "undefined":
									var l = a.get(i);
									s[n] = l !== e ? l : t(i, r, a)
							}
						}), s
					}

					function n(e, t) {
						if (e instanceof Array) {
							for (var n = 0; n < e.length; n++) t(n);
							"function" == typeof e.toJSON && t("toJSON")
						} else
							for (n in e) t(n)
					}

					function i() {
						this.keys = [], this.hb = []
					}
					p.Qb = function(e) {
						if (0 == arguments.length) throw Error("When calling ko.toJS, pass the object you want to convert.");
						return t(e, function(e) {
							for (var t = 0; p.C(e) && 10 > t; t++) e = e();
							return e
						})
					}, p.toJSON = function(e, t, n) {
						return e = p.Qb(e), p.a.eb(e, t, n)
					}, i.prototype = {
						save: function(e, t) {
							var n = p.a.m(this.keys, e);
							n >= 0 ? this.hb[n] = t : (this.keys.push(e), this.hb.push(t))
						},
						get: function(t) {
							return t = p.a.m(this.keys, t), t >= 0 ? this.hb[t] : e
						}
					}
				}(), p.b("toJS", p.Qb), p.b("toJSON", p.toJSON),
				function() {
					p.i = {
						q: function(t) {
							switch (p.a.t(t)) {
								case "option":
									return !0 === t.__ko__hasDomDataOptionValue__ ? p.a.e.get(t, p.d.options.Va) : 7 >= p.a.L ? t.getAttributeNode("value") && t.getAttributeNode("value").specified ? t.value : t.text : t.value;
								case "select":
									return 0 <= t.selectedIndex ? p.i.q(t.options[t.selectedIndex]) : e;
								default:
									return t.value
							}
						},
						ca: function(t, n, i) {
							switch (p.a.t(t)) {
								case "option":
									switch (typeof n) {
										case "string":
											p.a.e.set(t, p.d.options.Va, e), "__ko__hasDomDataOptionValue__" in t && delete t.__ko__hasDomDataOptionValue__, t.value = n;
											break;
										default:
											p.a.e.set(t, p.d.options.Va, n), t.__ko__hasDomDataOptionValue__ = !0, t.value = "number" == typeof n ? n : ""
									}
									break;
								case "select":
									("" === n || null === n) && (n = e);
									for (var o, r = -1, a = 0, s = t.options.length; s > a; ++a)
										if (o = p.i.q(t.options[a]), o == n || "" == o && n === e) {
											r = a;
											break
										}(i || r >= 0 || n === e && 1 < t.size) && (t.selectedIndex = r);
									break;
								default:
									(null === n || n === e) && (n = ""), t.value = n
							}
						}
					}
				}(), p.b("selectExtensions", p.i), p.b("selectExtensions.readValue", p.i.q), p.b("selectExtensions.writeValue", p.i.ca), p.h = function() {
					function e(e) {
						e = p.a.cb(e), 123 === e.charCodeAt(0) && (e = e.slice(1, -1));
						var t, n, a = [],
							s = e.match(i),
							l = 0;
						if (s) {
							s.push(",");
							for (var c, u = 0; c = s[u]; ++u) {
								var h = c.charCodeAt(0);
								if (44 === h) {
									if (0 >= l) {
										t && a.push(n ? {
											key: t,
											value: n.join("")
										} : {
											unknown: t
										}), t = n = l = 0;
										continue
									}
								} else if (58 === h) {
									if (!n) continue
								} else if (47 === h && u && 1 < c.length)(h = s[u - 1].match(o)) && !r[h[0]] && (e = e.substr(e.indexOf(c) + 1), s = e.match(i), s.push(","), u = -1, c = "/");
								else if (40 === h || 123 === h || 91 === h) ++l;
								else if (41 === h || 125 === h || 93 === h) --l;
								else if (!t && !n) {
									t = 34 === h || 39 === h ? c.slice(1, -1) : c;
									continue
								}
								n ? n.push(c) : n = [c]
							}
						}
						return a
					}
					var t = ["true", "false", "null", "undefined"],
						n = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,
						i = RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]", "g"),
						o = /[\])"'A-Za-z0-9_$]+$/,
						r = {
							"in": 1,
							"return": 1,
							"typeof": 1
						},
						a = {};
					return {
						ha: [],
						V: a,
						Wa: e,
						ya: function(i, o) {
							function r(e, i) {
								var o;
								if (!u) {
									var h = p.getBindingHandler(e);
									if (h && h.preprocess && !(i = h.preprocess(i, e, r))) return;
									(h = a[e]) && (o = i, 0 <= p.a.m(t, o) ? o = !1 : (h = o.match(n), o = null === h ? !1 : h[1] ? "Object(" + h[1] + ")" + h[2] : o), h = o), h && l.push("'" + e + "':function(_z){" + o + "=_z}")
								}
								c && (i = "function(){return " + i + " }"), s.push("'" + e + "':" + i)
							}
							o = o || {};
							var s = [],
								l = [],
								c = o.valueAccessors,
								u = o.bindingParams,
								h = "string" == typeof i ? e(i) : i;
							return p.a.u(h, function(e) {
								r(e.key || e.unknown, e.value)
							}), l.length && r("_ko_property_writers", "{" + l.join(",") + " }"), s.join(",")
						},
						lc: function(e, t) {
							for (var n = 0; n < e.length; n++)
								if (e[n].key == t) return !0;
							return !1
						},
						pa: function(e, t, n, i, o) {
							e && p.C(e) ? !p.Ra(e) || o && e.v() === i || e(i) : (e = t.get("_ko_property_writers")) && e[n] && e[n](i)
						}
					}
				}(), p.b("expressionRewriting", p.h), p.b("expressionRewriting.bindingRewriteValidators", p.h.ha), p.b("expressionRewriting.parseObjectLiteral", p.h.Wa), p.b("expressionRewriting.preProcessBindings", p.h.ya), p.b("expressionRewriting._twoWayBindings", p.h.V), p.b("jsonExpressionRewriting", p.h), p.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson", p.h.ya),
				function() {
					function e(e) {
						return 8 == e.nodeType && a.test(r ? e.text : e.nodeValue)
					}

					function t(e) {
						return 8 == e.nodeType && s.test(r ? e.text : e.nodeValue)
					}

					function i(n, i) {
						for (var o = n, r = 1, a = []; o = o.nextSibling;) {
							if (t(o) && (r--, 0 === r)) return a;
							a.push(o), e(o) && r++
						}
						if (!i) throw Error("Cannot find closing comment tag to match: " + n.nodeValue);
						return null
					}

					function o(e, t) {
						var n = i(e, t);
						return n ? 0 < n.length ? n[n.length - 1].nextSibling : e.nextSibling : null
					}
					var r = n && "<!--test-->" === n.createComment("test").text,
						a = r ? /^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/,
						s = r ? /^\x3c!--\s*\/ko\s*--\x3e$/ : /^\s*\/ko\s*$/,
						l = {
							ul: !0,
							ol: !0
						};
					p.f = {
						Q: {},
						childNodes: function(t) {
							return e(t) ? i(t) : t.childNodes
						},
						ja: function(t) {
							if (e(t)) {
								t = p.f.childNodes(t);
								for (var n = 0, i = t.length; i > n; n++) p.removeNode(t[n])
							} else p.a.Ka(t)
						},
						T: function(t, n) {
							if (e(t)) {
								p.f.ja(t);
								for (var i = t.nextSibling, o = 0, r = n.length; r > o; o++) i.parentNode.insertBefore(n[o], i)
							} else p.a.T(t, n)
						},
						Hb: function(t, n) {
							e(t) ? t.parentNode.insertBefore(n, t.nextSibling) : t.firstChild ? t.insertBefore(n, t.firstChild) : t.appendChild(n)
						},
						Bb: function(t, n, i) {
							i ? e(t) ? t.parentNode.insertBefore(n, i.nextSibling) : i.nextSibling ? t.insertBefore(n, i.nextSibling) : t.appendChild(n) : p.f.Hb(t, n)
						},
						firstChild: function(n) {
							return e(n) ? !n.nextSibling || t(n.nextSibling) ? null : n.nextSibling : n.firstChild
						},
						nextSibling: function(n) {
							return e(n) && (n = o(n)), n.nextSibling && t(n.nextSibling) ? null : n.nextSibling
						},
						gc: e,
						xc: function(e) {
							return (e = (r ? e.text : e.nodeValue).match(a)) ? e[1] : null
						},
						Fb: function(n) {
							if (l[p.a.t(n)]) {
								var i = n.firstChild;
								if (i)
									do
										if (1 === i.nodeType) {
											var r;
											r = i.firstChild;
											var a = null;
											if (r)
												do
													if (a) a.push(r);
													else if (e(r)) {
												var s = o(r, !0);
												s ? r = s : a = [r]
											} else t(r) && (a = [r]);
											while (r = r.nextSibling);
											if (r = a)
												for (a = i.nextSibling, s = 0; s < r.length; s++) a ? n.insertBefore(r[s], a) : n.appendChild(r[s])
										}
								while (i = i.nextSibling)
							}
						}
					}
				}(), p.b("virtualElements", p.f), p.b("virtualElements.allowedBindings", p.f.Q), p.b("virtualElements.emptyNode", p.f.ja), p.b("virtualElements.insertAfter", p.f.Bb), p.b("virtualElements.prepend", p.f.Hb), p.b("virtualElements.setDomNodeChildren", p.f.T),
				function() {
					p.J = function() {
						this.Yb = {}
					}, p.a.extend(p.J.prototype, {
						nodeHasBindings: function(e) {
							switch (e.nodeType) {
								case 1:
									return null != e.getAttribute("data-bind") || p.g.getComponentNameForNode(e);
								case 8:
									return p.f.gc(e);
								default:
									return !1
							}
						},
						getBindings: function(e, t) {
							var n = this.getBindingsString(e, t),
								n = n ? this.parseBindingsString(n, t, e) : null;
							return p.g.mb(n, e, t, !1)
						},
						getBindingAccessors: function(e, t) {
							var n = this.getBindingsString(e, t),
								n = n ? this.parseBindingsString(n, t, e, {
									valueAccessors: !0
								}) : null;
							return p.g.mb(n, e, t, !0)
						},
						getBindingsString: function(e) {
							switch (e.nodeType) {
								case 1:
									return e.getAttribute("data-bind");
								case 8:
									return p.f.xc(e);
								default:
									return null
							}
						},
						parseBindingsString: function(e, t, n, i) {
							try {
								var o, r = this.Yb,
									a = e + (i && i.valueAccessors || "");
								if (!(o = r[a])) {
									var s, l = "with($context){with($data||{}){return{" + p.h.ya(e, i) + "}}}";
									s = new Function("$context", "$element", l), o = r[a] = s
								}
								return o(t, n)
							} catch (c) {
								throw c.message = "Unable to parse bindings.\nBindings value: " + e + "\nMessage: " + c.message, c
							}
						}
					}), p.J.instance = new p.J
				}(), p.b("bindingProvider", p.J),
				function() {
					function n(e) {
						return function() {
							return e
						}
					}

					function i(e) {
						return e()
					}

					function r(e) {
						return p.a.na(p.k.B(e), function(t, n) {
							return function() {
								return e()[n]
							}
						})
					}

					function a(e, t) {
						return r(this.getBindings.bind(this, e, t))
					}

					function s(e, t, n) {
						var i, o = p.f.firstChild(t),
							r = p.J.instance,
							a = r.preprocessNode;
						if (a) {
							for (; i = o;) o = p.f.nextSibling(i), a.call(r, i);
							o = p.f.firstChild(t)
						}
						for (; i = o;) o = p.f.nextSibling(i), l(e, i, n)
					}

					function l(e, t, n) {
						var i = !0,
							o = 1 === t.nodeType;
						o && p.f.Fb(t), (o && n || p.J.instance.nodeHasBindings(t)) && (i = u(t, null, e, n).shouldBindDescendants), i && !d[p.a.t(t)] && s(e, t, !o)
					}

					function c(e) {
						var t = [],
							n = {},
							i = [];
						return p.a.G(e, function o(r) {
							if (!n[r]) {
								var a = p.getBindingHandler(r);
								a && (a.after && (i.push(r), p.a.u(a.after, function(t) {
									if (e[t]) {
										if (-1 !== p.a.m(i, t)) throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + i.join(", "));
										o(t)
									}
								}), i.length--), t.push({
									key: r,
									zb: a
								})), n[r] = !0
							}
						}), t
					}

					function u(t, n, o, r) {
						var s = p.a.e.get(t, f);
						if (!n) {
							if (s) throw Error("You cannot apply bindings multiple times to the same element.");
							p.a.e.set(t, f, !0)
						}!s && r && p.Ob(t, o);
						var l;
						if (n && "function" != typeof n) l = n;
						else {
							var u = p.J.instance,
								h = u.getBindingAccessors || a,
								d = p.j(function() {
									return (l = n ? n(o, t) : h.call(u, t, o)) && o.I && o.I(), l
								}, null, {
									o: t
								});
							l && d.Z() || (d = null)
						}
						var m;
						if (l) {
							var g = d ? function(e) {
									return function() {
										return i(d()[e])
									}
								} : function(e) {
									return l[e]
								},
								v = function() {
									return p.a.na(d ? d() : l, i)
								};
							v.get = function(e) {
								return l[e] && i(g(e))
							}, v.has = function(e) {
								return e in l
							}, r = c(l), p.a.u(r, function(n) {
								var i = n.zb.init,
									r = n.zb.update,
									a = n.key;
								if (8 === t.nodeType && !p.f.Q[a]) throw Error("The binding '" + a + "' cannot be used with virtual elements");
								try {
									"function" == typeof i && p.k.B(function() {
										var n = i(t, g(a), v, o.$data, o);
										if (n && n.controlsDescendantBindings) {
											if (m !== e) throw Error("Multiple bindings (" + m + " and " + a + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
											m = a
										}
									}), "function" == typeof r && p.j(function() {
										r(t, g(a), v, o.$data, o)
									}, null, {
										o: t
									})
								} catch (s) {
									throw s.message = 'Unable to process binding "' + a + ": " + l[a] + '"\nMessage: ' + s.message, s
								}
							})
						}
						return {
							shouldBindDescendants: m === e
						}
					}

					function h(e) {
						return e && e instanceof p.N ? e : new p.N(e)
					}
					p.d = {};
					var d = {
						script: !0
					};
					p.getBindingHandler = function(e) {
						return p.d[e]
					}, p.N = function(t, n, i, o) {
						var r, a = this,
							s = "function" == typeof t && !p.C(t),
							l = p.j(function() {
								var e = s ? t() : t,
									r = p.a.c(e);
								return n ? (n.I && n.I(), p.a.extend(a, n), l && (a.I = l)) : (a.$parents = [], a.$root = r, a.ko = p), a.$rawData = e, a.$data = r, i && (a[i] = r), o && o(a, n, r), a.$data
							}, null, {
								Ia: function() {
									return r && !p.a.ob(r)
								},
								o: !0
							});
						l.Z() && (a.I = l, l.equalityComparer = null, r = [], l.Tb = function(t) {
							r.push(t), p.a.w.da(t, function(t) {
								p.a.ua(r, t), r.length || (l.K(), a.I = l = e)
							})
						})
					}, p.N.prototype.createChildContext = function(e, t, n) {
						return new p.N(e, this, t, function(e, t) {
							e.$parentContext = t, e.$parent = t.$data, e.$parents = (t.$parents || []).slice(0), e.$parents.unshift(e.$parent), n && n(e)
						})
					}, p.N.prototype.extend = function(e) {
						return new p.N(this.I || this.$data, this, null, function(t, n) {
							t.$rawData = n.$rawData, p.a.extend(t, "function" == typeof e ? e() : e)
						})
					};
					var f = p.a.e.F(),
						m = p.a.e.F();
					p.Ob = function(e, t) {
						return 2 != arguments.length ? p.a.e.get(e, m) : (p.a.e.set(e, m, t), void(t.I && t.I.Tb(e)))
					}, p.ra = function(e, t, n) {
						return 1 === e.nodeType && p.f.Fb(e), u(e, t, h(n), !0)
					}, p.Wb = function(e, t, i) {
						return i = h(i), p.ra(e, "function" == typeof t ? r(t.bind(null, i, e)) : p.a.na(t, n), i)
					}, p.Ca = function(e, t) {
						1 !== t.nodeType && 8 !== t.nodeType || s(h(e), t, !0)
					}, p.pb = function(e, n) {
						if (!o && t.jQuery && (o = t.jQuery), n && 1 !== n.nodeType && 8 !== n.nodeType) throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
						n = n || t.document.body, l(h(e), n, !0)
					}, p.Ha = function(t) {
						switch (t.nodeType) {
							case 1:
							case 8:
								var n = p.Ob(t);
								if (n) return n;
								if (t.parentNode) return p.Ha(t.parentNode)
						}
						return e
					}, p.$b = function(t) {
						return (t = p.Ha(t)) ? t.$data : e
					}, p.b("bindingHandlers", p.d), p.b("applyBindings", p.pb), p.b("applyBindingsToDescendants", p.Ca), p.b("applyBindingAccessorsToNode", p.ra), p.b("applyBindingsToNode", p.Wb), p.b("contextFor", p.Ha), p.b("dataFor", p.$b)
				}(),
				function(e) {
					function t(t, i) {
						var a, s = o.hasOwnProperty(t) ? o[t] : e;
						s || (s = o[t] = new p.P, n(t, function(e) {
							r[t] = e, delete o[t], a ? s.notifySubscribers(e) : setTimeout(function() {
								s.notifySubscribers(e)
							}, 0)
						}), a = !0), s.U(i)
					}

					function n(e, t) {
						i("getConfig", [e], function(n) {
							n ? i("loadComponent", [e, n], function(e) {
								t(e)
							}) : t(null)
						})
					}

					function i(t, n, o, r) {
						r || (r = p.g.loaders.slice(0));
						var a = r.shift();
						if (a) {
							var s = a[t];
							if (s) {
								var l = !1;
								if (s.apply(a, n.concat(function(e) {
										l ? o(null) : null !== e ? o(e) : i(t, n, o, r)
									})) !== e && (l = !0, !a.suppressLoaderExceptions)) throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.")
							} else i(t, n, o, r)
						} else o(null)
					}
					var o = {},
						r = {};
					p.g = {
						get: function(n, i) {
							var o = r.hasOwnProperty(n) ? r[n] : e;
							o ? setTimeout(function() {
								i(o)
							}, 0) : t(n, i)
						},
						tb: function(e) {
							delete r[e]
						},
						jb: i
					}, p.g.loaders = [], p.b("components", p.g), p.b("components.get", p.g.get), p.b("components.clearCachedDefinition", p.g.tb)
				}(),
				function() {
					function e(e, t, n, i) {
						function o() {
							0 === --s && i(r)
						}
						var r = {},
							s = 2,
							l = n.template;
						n = n.viewModel, l ? a(t, l, function(t) {
							p.g.jb("loadTemplate", [e, t], function(e) {
								r.template = e, o()
							})
						}) : o(), n ? a(t, n, function(t) {
							p.g.jb("loadViewModel", [e, t], function(e) {
								r[u] = e, o()
							})
						}) : o()
					}

					function i(e, t, n) {
						if ("function" == typeof t) n(function(e) {
							return new t(e)
						});
						else if ("function" == typeof t[u]) n(t[u]);
						else if ("instance" in t) {
							var o = t.instance;
							n(function() {
								return o
							})
						} else "viewModel" in t ? i(e, t.viewModel, n) : e("Unknown viewModel value: " + t)
					}

					function o(e) {
						switch (p.a.t(e)) {
							case "script":
								return p.a.ba(e.text);
							case "textarea":
								return p.a.ba(e.value);
							case "template":
								if (r(e.content)) return p.a.ia(e.content.childNodes)
						}
						return p.a.ia(e.childNodes)
					}

					function r(e) {
						return t.DocumentFragment ? e instanceof DocumentFragment : e && 11 === e.nodeType
					}

					function a(e, n, i) {
						"string" == typeof n.require ? s || t.require ? (s || t.require)([n.require], i) : e("Uses require, but no AMD loader is present") : i(n)
					}

					function l(e) {
						return function(t) {
							throw Error("Component '" + e + "': " + t)
						}
					}
					var c = {};
					p.g.tc = function(e, t) {
						if (!t) throw Error("Invalid configuration for " + e);
						if (p.g.Qa(e)) throw Error("Component " + e + " is already registered");
						c[e] = t
					}, p.g.Qa = function(e) {
						return e in c
					}, p.g.wc = function(e) {
						delete c[e], p.g.tb(e)
					}, p.g.ub = {
						getConfig: function(e, t) {
							t(c.hasOwnProperty(e) ? c[e] : null)
						},
						loadComponent: function(t, n, i) {
							var o = l(t);
							a(o, n, function(n) {
								e(t, o, n, i)
							})
						},
						loadTemplate: function(e, i, a) {
							if (e = l(e), "string" == typeof i) a(p.a.ba(i));
							else if (i instanceof Array) a(i);
							else if (r(i)) a(p.a.S(i.childNodes));
							else if (i.element)
								if (i = i.element, t.HTMLElement ? i instanceof HTMLElement : i && i.tagName && 1 === i.nodeType) a(o(i));
								else if ("string" == typeof i) {
								var s = n.getElementById(i);
								s ? a(o(s)) : e("Cannot find element with ID " + i)
							} else e("Unknown element type: " + i);
							else e("Unknown template value: " + i)
						},
						loadViewModel: function(e, t, n) {
							i(l(e), t, n)
						}
					};
					var u = "createViewModel";
					p.b("components.register", p.g.tc), p.b("components.isRegistered", p.g.Qa), p.b("components.unregister", p.g.wc), p.b("components.defaultLoader", p.g.ub), p.g.loaders.push(p.g.ub), p.g.Ub = c
				}(),
				function() {
					function e(e, n) {
						var i = e.getAttribute("params");
						if (i) {
							var i = t.parseBindingsString(i, n, e, {
									valueAccessors: !0,
									bindingParams: !0
								}),
								i = p.a.na(i, function(t) {
									return p.s(t, null, {
										o: e
									})
								}),
								o = p.a.na(i, function(t) {
									return t.Z() ? p.s(function() {
										return p.a.c(t())
									}, null, {
										o: e
									}) : t.v()
								});
							return o.hasOwnProperty("$raw") || (o.$raw = i), o
						}
						return {
							$raw: {}
						}
					}
					p.g.getComponentNameForNode = function(e) {
						return e = p.a.t(e), p.g.Qa(e) && e
					}, p.g.mb = function(t, n, i, o) {
						if (1 === n.nodeType) {
							var r = p.g.getComponentNameForNode(n);
							if (r) {
								if (t = t || {}, t.component) throw Error('Cannot use the "component" binding on a custom element matching a component');
								var a = {
									name: r,
									params: e(n, i)
								};
								t.component = o ? function() {
									return a
								} : a
							}
						}
						return t
					};
					var t = new p.J;
					9 > p.a.L && (p.g.register = function(e) {
						return function(t) {
							return n.createElement(t), e.apply(this, arguments)
						}
					}(p.g.register), n.createDocumentFragment = function(e) {
						return function() {
							var t, n = e(),
								i = p.g.Ub;
							for (t in i) i.hasOwnProperty(t) && n.createElement(t);
							return n
						}
					}(n.createDocumentFragment))
				}(),
				function() {
					var e = 0;
					p.d.component = {
						init: function(t, n, i, o, r) {
							function a() {
								var e = s && s.dispose;
								"function" == typeof e && e.call(s), l = null
							}
							var s, l;
							return p.a.w.da(t, a), p.s(function() {
								var i, o, c = p.a.c(n());
								if ("string" == typeof c ? i = c : (i = p.a.c(c.name), o = p.a.c(c.params)), !i) throw Error("No component name specified");
								var u = l = ++e;
								p.g.get(i, function(e) {
									if (l === u) {
										if (a(), !e) throw Error("Unknown component '" + i + "'");
										var n = e.template;
										if (!n) throw Error("Component '" + i + "' has no template");
										n = p.a.ia(n), p.f.T(t, n);
										var n = o,
											c = e.createViewModel;
										e = c ? c.call(e, n, {
											element: t
										}) : n, n = r.createChildContext(e), s = e, p.Ca(n, t)
									}
								})
							}, null, {
								o: t
							}), {
								controlsDescendantBindings: !0
							}
						}
					}, p.f.Q.component = !0
				}();
			var y = {
				"class": "className",
				"for": "htmlFor"
			};
			p.d.attr = {
					update: function(t, n) {
						var i = p.a.c(n()) || {};
						p.a.G(i, function(n, i) {
							i = p.a.c(i);
							var o = !1 === i || null === i || i === e;
							o && t.removeAttribute(n), 8 >= p.a.L && n in y ? (n = y[n], o ? t.removeAttribute(n) : t[n] = i) : o || t.setAttribute(n, i.toString()), "name" === n && p.a.Mb(t, o ? "" : i.toString())
						})
					}
				},
				function() {
					p.d.checked = {
						after: ["value", "attr"],
						init: function(t, n, i) {
							function o() {
								var e = t.checked,
									o = h ? a() : e;
								if (!p.Y.ma() && (!l || e)) {
									var r = p.k.B(n);
									c ? u !== o ? (e && (p.a.ea(r, o, !0), p.a.ea(r, u, !1)), u = o) : p.a.ea(r, o, e) : p.h.pa(r, i, "checked", o, !0)
								}
							}

							function r() {
								var e = p.a.c(n());
								t.checked = c ? 0 <= p.a.m(e, a()) : s ? e : a() === e
							}
							var a = p.Ib(function() {
									return i.has("checkedValue") ? p.a.c(i.get("checkedValue")) : i.has("value") ? p.a.c(i.get("value")) : t.value
								}),
								s = "checkbox" == t.type,
								l = "radio" == t.type;
							if (s || l) {
								var c = s && p.a.c(n()) instanceof Array,
									u = c ? a() : e,
									h = l || c;
								l && !t.name && p.d.uniqueName.init(t, function() {
									return !0
								}), p.s(o, null, {
									o: t
								}), p.a.n(t, "click", o), p.s(r, null, {
									o: t
								})
							}
						}
					}, p.h.V.checked = !0, p.d.checkedValue = {
						update: function(e, t) {
							e.value = p.a.c(t())
						}
					}
				}(), p.d.css = {
					update: function(e, t) {
						var n = p.a.c(t());
						"object" == typeof n ? p.a.G(n, function(t, n) {
							n = p.a.c(n), p.a.Ba(e, t, n)
						}) : (n = String(n || ""), p.a.Ba(e, e.__ko__cssValue, !1), e.__ko__cssValue = n, p.a.Ba(e, n, !0))
					}
				}, p.d.enable = {
					update: function(e, t) {
						var n = p.a.c(t());
						n && e.disabled ? e.removeAttribute("disabled") : n || e.disabled || (e.disabled = !0)
					}
				}, p.d.disable = {
					update: function(e, t) {
						p.d.enable.update(e, function() {
							return !p.a.c(t())
						})
					}
				}, p.d.event = {
					init: function(e, t, n, i, o) {
						var r = t() || {};
						p.a.G(r, function(r) {
							"string" == typeof r && p.a.n(e, r, function(e) {
								var a, s = t()[r];
								if (s) {
									try {
										var l = p.a.S(arguments);
										i = o.$data, l.unshift(i), a = s.apply(i, l)
									} finally {
										!0 !== a && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
									}!1 === n.get(r + "Bubble") && (e.cancelBubble = !0, e.stopPropagation && e.stopPropagation())
								}
							})
						})
					}
				}, p.d.foreach = {
					Eb: function(e) {
						return function() {
							var t = e(),
								n = p.a.Xa(t);
							return n && "number" != typeof n.length ? (p.a.c(t), {
								foreach: n.data,
								as: n.as,
								includeDestroyed: n.includeDestroyed,
								afterAdd: n.afterAdd,
								beforeRemove: n.beforeRemove,
								afterRender: n.afterRender,
								beforeMove: n.beforeMove,
								afterMove: n.afterMove,
								templateEngine: p.O.Oa
							}) : {
								foreach: t,
								templateEngine: p.O.Oa
							}
						}
					},
					init: function(e, t) {
						return p.d.template.init(e, p.d.foreach.Eb(t))
					},
					update: function(e, t, n, i, o) {
						return p.d.template.update(e, p.d.foreach.Eb(t), n, i, o)
					}
				}, p.h.ha.foreach = !1, p.f.Q.foreach = !0, p.d.hasfocus = {
					init: function(e, t, n) {
						function i(i) {
							e.__ko_hasfocusUpdating = !0;
							var o = e.ownerDocument;
							if ("activeElement" in o) {
								var r;
								try {
									r = o.activeElement
								} catch (a) {
									r = o.body
								}
								i = r === e
							}
							o = t(), p.h.pa(o, n, "hasfocus", i, !0), e.__ko_hasfocusLastValue = i, e.__ko_hasfocusUpdating = !1
						}
						var o = i.bind(null, !0),
							r = i.bind(null, !1);
						p.a.n(e, "focus", o), p.a.n(e, "focusin", o), p.a.n(e, "blur", r), p.a.n(e, "focusout", r)
					},
					update: function(e, t) {
						var n = !!p.a.c(t());
						e.__ko_hasfocusUpdating || e.__ko_hasfocusLastValue === n || (n ? e.focus() : e.blur(), p.k.B(p.a.oa, null, [e, n ? "focusin" : "focusout"]))
					}
				}, p.h.V.hasfocus = !0, p.d.hasFocus = p.d.hasfocus, p.h.V.hasFocus = !0, p.d.html = {
					init: function() {
						return {
							controlsDescendantBindings: !0
						}
					},
					update: function(e, t) {
						p.a.$a(e, t())
					}
				}, h("if"), h("ifnot", !1, !0), h("with", !0, !1, function(e, t) {
					return e.createChildContext(t)
				});
			var b = {};
			p.d.options = {
					init: function(e) {
						if ("select" !== p.a.t(e)) throw Error("options binding applies only to SELECT elements");
						for (; 0 < e.length;) e.remove(0);
						return {
							controlsDescendantBindings: !0
						}
					},
					update: function(t, n, i) {
						function o() {
							return p.a.ta(t.options, function(e) {
								return e.selected
							})
						}

						function r(e, t, n) {
							var i = typeof t;
							return "function" == i ? t(e) : "string" == i ? e[t] : n
						}

						function a(e, n) {
							if (h.length) {
								var i = 0 <= p.a.m(h, p.i.q(n[0]));
								p.a.Nb(n[0], i), d && !i && p.k.B(p.a.oa, null, [t, "change"])
							}
						}
						var s = 0 != t.length && t.multiple ? t.scrollTop : null,
							l = p.a.c(n()),
							c = i.get("optionsIncludeDestroyed");
						n = {};
						var u, h;
						h = t.multiple ? p.a.Da(o(), p.i.q) : 0 <= t.selectedIndex ? [p.i.q(t.options[t.selectedIndex])] : [], l && ("undefined" == typeof l.length && (l = [l]), u = p.a.ta(l, function(t) {
							return c || t === e || null === t || !p.a.c(t._destroy)
						}), i.has("optionsCaption") && (l = p.a.c(i.get("optionsCaption")), null !== l && l !== e && u.unshift(b)));
						var d = !1;
						n.beforeRemove = function(e) {
							t.removeChild(e)
						}, l = a, i.has("optionsAfterRender") && (l = function(t, n) {
							a(0, n), p.k.B(i.get("optionsAfterRender"), null, [n[0], t !== b ? t : e])
						}), p.a.Za(t, u, function(n, o, a) {
							return a.length && (h = a[0].selected ? [p.i.q(a[0])] : [], d = !0), o = t.ownerDocument.createElement("option"), n === b ? (p.a.bb(o, i.get("optionsCaption")), p.i.ca(o, e)) : (a = r(n, i.get("optionsValue"), n), p.i.ca(o, p.a.c(a)), n = r(n, i.get("optionsText"), a), p.a.bb(o, n)), [o]
						}, n, l), p.k.B(function() {
							i.get("valueAllowUnset") && i.has("value") ? p.i.ca(t, p.a.c(i.get("value")), !0) : (t.multiple ? h.length && o().length < h.length : h.length && 0 <= t.selectedIndex ? p.i.q(t.options[t.selectedIndex]) !== h[0] : h.length || 0 <= t.selectedIndex) && p.a.oa(t, "change")
						}), p.a.dc(t), s && 20 < Math.abs(s - t.scrollTop) && (t.scrollTop = s)
					}
				}, p.d.options.Va = p.a.e.F(), p.d.selectedOptions = {
					after: ["options", "foreach"],
					init: function(e, t, n) {
						p.a.n(e, "change", function() {
							var i = t(),
								o = [];
							p.a.u(e.getElementsByTagName("option"), function(e) {
								e.selected && o.push(p.i.q(e))
							}), p.h.pa(i, n, "selectedOptions", o)
						})
					},
					update: function(e, t) {
						if ("select" != p.a.t(e)) throw Error("values binding applies only to SELECT elements");
						var n = p.a.c(t());
						n && "number" == typeof n.length && p.a.u(e.getElementsByTagName("option"), function(e) {
							var t = 0 <= p.a.m(n, p.i.q(e));
							p.a.Nb(e, t)
						})
					}
				}, p.h.V.selectedOptions = !0, p.d.style = {
					update: function(t, n) {
						var i = p.a.c(n() || {});
						p.a.G(i, function(n, i) {
							i = p.a.c(i), (null === i || i === e || !1 === i) && (i = ""), t.style[n] = i
						})
					}
				}, p.d.submit = {
					init: function(e, t, n, i, o) {
						if ("function" != typeof t()) throw Error("The value for a submit binding must be a function");
						p.a.n(e, "submit", function(n) {
							var i, r = t();
							try {
								i = r.call(o.$data, e)
							} finally {
								!0 !== i && (n.preventDefault ? n.preventDefault() : n.returnValue = !1)
							}
						})
					}
				}, p.d.text = {
					init: function() {
						return {
							controlsDescendantBindings: !0
						}
					},
					update: function(e, t) {
						p.a.bb(e, t())
					}
				}, p.f.Q.text = !0,
				function() {
					if (t && t.navigator) var n = function(e) {
							return e ? parseFloat(e[1]) : void 0
						},
						i = t.opera && t.opera.version && parseInt(t.opera.version()),
						o = t.navigator.userAgent,
						r = n(o.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
						a = n(o.match(/Firefox\/([^ ]*)/));
					if (10 > p.a.L) var s = p.a.e.F(),
						l = p.a.e.F(),
						c = function(e) {
							var t = this.activeElement;
							(t = t && p.a.e.get(t, l)) && t(e)
						},
						u = function(e, t) {
							var n = e.ownerDocument;
							p.a.e.get(n, s) || (p.a.e.set(n, s, !0), p.a.n(n, "selectionchange", c)), p.a.e.set(e, l, t)
						};
					p.d.textInput = {
						init: function(t, n, o) {
							function s(e, n) {
								p.a.n(t, e, n)
							}

							function l() {
								var i = p.a.c(n());
								(null === i || i === e) && (i = ""), f !== e && i === f ? setTimeout(l, 4) : t.value !== i && (m = i, t.value = i)
							}

							function c() {
								d || (f = t.value, d = setTimeout(h, 4))
							}

							function h() {
								clearTimeout(d), f = d = e;
								var i = t.value;
								m !== i && (m = i, p.h.pa(n(), o, "textInput", i))
							}
							var d, f, m = t.value;
							10 > p.a.L ? (s("propertychange", function(e) {
								"value" === e.propertyName && h()
							}), 8 == p.a.L && (s("keyup", h), s("keydown", h)), 8 <= p.a.L && (u(t, h), s("dragend", c))) : (s("input", h), 5 > r && "textarea" === p.a.t(t) ? (s("keydown", c), s("paste", c), s("cut", c)) : 11 > i ? s("keydown", c) : 4 > a && (s("DOMAutoComplete", h), s("dragdrop", h), s("drop", h))), s("change", h), p.s(l, null, {
								o: t
							})
						}
					}, p.h.V.textInput = !0, p.d.textinput = {
						preprocess: function(e, t, n) {
							n("textInput", e)
						}
					}
				}(), p.d.uniqueName = {
					init: function(e, t) {
						if (t()) {
							var n = "ko_unique_" + ++p.d.uniqueName.Zb;
							p.a.Mb(e, n)
						}
					}
				}, p.d.uniqueName.Zb = 0, p.d.value = {
					after: ["options", "foreach"],
					init: function(e, t, n) {
						if ("input" != e.tagName.toLowerCase() || "checkbox" != e.type && "radio" != e.type) {
							var i = ["change"],
								o = n.get("valueUpdate"),
								r = !1,
								a = null;
							o && ("string" == typeof o && (o = [o]), p.a.ga(i, o), i = p.a.rb(i));
							var s = function() {
								a = null, r = !1;
								var i = t(),
									o = p.i.q(e);
								p.h.pa(i, n, "value", o)
							};
							!p.a.L || "input" != e.tagName.toLowerCase() || "text" != e.type || "off" == e.autocomplete || e.form && "off" == e.form.autocomplete || -1 != p.a.m(i, "propertychange") || (p.a.n(e, "propertychange", function() {
								r = !0
							}), p.a.n(e, "focus", function() {
								r = !1
							}), p.a.n(e, "blur", function() {
								r && s()
							})), p.a.u(i, function(t) {
								var n = s;
								p.a.vc(t, "after") && (n = function() {
									a = p.i.q(e), setTimeout(s, 0)
								}, t = t.substring(5)), p.a.n(e, t, n)
							});
							var l = function() {
								var i = p.a.c(t()),
									o = p.i.q(e);
								if (null !== a && i === a) setTimeout(l, 0);
								else if (i !== o)
									if ("select" === p.a.t(e)) {
										var r = n.get("valueAllowUnset"),
											o = function() {
												p.i.ca(e, i, r)
											};
										o(), r || i === p.i.q(e) ? setTimeout(o, 0) : p.k.B(p.a.oa, null, [e, "change"])
									} else p.i.ca(e, i)
							};
							p.s(l, null, {
								o: e
							})
						} else p.ra(e, {
							checkedValue: t
						})
					},
					update: function() {}
				}, p.h.V.value = !0, p.d.visible = {
					update: function(e, t) {
						var n = p.a.c(t()),
							i = "none" != e.style.display;
						n && !i ? e.style.display = "" : !n && i && (e.style.display = "none")
					}
				},
				function(e) {
					p.d[e] = {
						init: function(t, n, i, o, r) {
							return p.d.event.init.call(this, t, function() {
								var t = {};
								return t[e] = n(), t
							}, i, o, r)
						}
					}
				}("click"), p.H = function() {}, p.H.prototype.renderTemplateSource = function() {
					throw Error("Override renderTemplateSource")
				}, p.H.prototype.createJavaScriptEvaluatorBlock = function() {
					throw Error("Override createJavaScriptEvaluatorBlock")
				}, p.H.prototype.makeTemplateSource = function(e, t) {
					if ("string" == typeof e) {
						t = t || n;
						var i = t.getElementById(e);
						if (!i) throw Error("Cannot find template with ID " + e);
						return new p.r.l(i)
					}
					if (1 == e.nodeType || 8 == e.nodeType) return new p.r.fa(e);
					throw Error("Unknown template type: " + e)
				}, p.H.prototype.renderTemplate = function(e, t, n, i) {
					return e = this.makeTemplateSource(e, i), this.renderTemplateSource(e, t, n)
				}, p.H.prototype.isTemplateRewritten = function(e, t) {
					return !1 === this.allowTemplateRewriting ? !0 : this.makeTemplateSource(e, t).data("isRewritten")
				}, p.H.prototype.rewriteTemplate = function(e, t, n) {
					e = this.makeTemplateSource(e, n), t = t(e.text()), e.text(t), e.data("isRewritten", !0)
				}, p.b("templateEngine", p.H), p.fb = function() {
					function e(e, t, n, i) {
						e = p.h.Wa(e);
						for (var o = p.h.ha, r = 0; r < e.length; r++) {
							var a = e[r].key;
							if (o.hasOwnProperty(a)) {
								var s = o[a];
								if ("function" == typeof s) {
									if (a = s(e[r].value)) throw Error(a)
								} else if (!s) throw Error("This template engine does not support the '" + a + "' binding within its templates")
							}
						}
						return n = "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + p.h.ya(e, {
							valueAccessors: !0
						}) + " } })()},'" + n.toLowerCase() + "')", i.createJavaScriptEvaluatorBlock(n) + t
					}
					var t = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,
						n = /\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;
					return {
						ec: function(e, t, n) {
							t.isTemplateRewritten(e, n) || t.rewriteTemplate(e, function(e) {
								return p.fb.nc(e, t)
							}, n)
						},
						nc: function(i, o) {
							return i.replace(t, function(t, n, i, r, a) {
								return e(a, n, i, o)
							}).replace(n, function(t, n) {
								return e(n, "<!-- ko -->", "#comment", o)
							})
						},
						Xb: function(e, t) {
							return p.D.Ua(function(n, i) {
								var o = n.nextSibling;
								o && o.nodeName.toLowerCase() === t && p.ra(o, e, i)
							})
						}
					}
				}(), p.b("__tr_ambtns", p.fb.Xb),
				function() {
					p.r = {}, p.r.l = function(e) {
						this.l = e
					}, p.r.l.prototype.text = function() {
						var e = p.a.t(this.l),
							e = "script" === e ? "text" : "textarea" === e ? "value" : "innerHTML";
						if (0 == arguments.length) return this.l[e];
						var t = arguments[0];
						"innerHTML" === e ? p.a.$a(this.l, t) : this.l[e] = t
					};
					var t = p.a.e.F() + "_";
					p.r.l.prototype.data = function(e) {
						return 1 === arguments.length ? p.a.e.get(this.l, t + e) : void p.a.e.set(this.l, t + e, arguments[1])
					};
					var n = p.a.e.F();
					p.r.fa = function(e) {
						this.l = e
					}, p.r.fa.prototype = new p.r.l, p.r.fa.prototype.text = function() {
						if (0 == arguments.length) {
							var t = p.a.e.get(this.l, n) || {};
							return t.gb === e && t.Ga && (t.gb = t.Ga.innerHTML), t.gb
						}
						p.a.e.set(this.l, n, {
							gb: arguments[0]
						})
					}, p.r.l.prototype.nodes = function() {
						return 0 == arguments.length ? (p.a.e.get(this.l, n) || {}).Ga : void p.a.e.set(this.l, n, {
							Ga: arguments[0]
						})
					}, p.b("templateSources", p.r), p.b("templateSources.domElement", p.r.l), p.b("templateSources.anonymousTemplate", p.r.fa)
				}(),
				function() {
					function t(e, t, n) {
						var i;
						for (t = p.f.nextSibling(t); e && (i = e) !== t;) e = p.f.nextSibling(i), n(i, e)
					}

					function n(e, n) {
						if (e.length) {
							var i = e[0],
								o = e[e.length - 1],
								r = i.parentNode,
								a = p.J.instance,
								s = a.preprocessNode;
							if (s) {
								if (t(i, o, function(e, t) {
										var n = e.previousSibling,
											r = s.call(a, e);
										r && (e === i && (i = r[0] || t), e === o && (o = r[r.length - 1] || n))
									}), e.length = 0, !i) return;
								i === o ? e.push(i) : (e.push(i, o), p.a.ka(e, r))
							}
							t(i, o, function(e) {
								1 !== e.nodeType && 8 !== e.nodeType || p.pb(n, e)
							}), t(i, o, function(e) {
								1 !== e.nodeType && 8 !== e.nodeType || p.D.Sb(e, [n])
							}), p.a.ka(e, r)
						}
					}

					function i(e) {
						return e.nodeType ? e : 0 < e.length ? e[0] : null
					}

					function o(e, t, o, a, s) {
						s = s || {};
						var l = e && i(e),
							l = l && l.ownerDocument,
							c = s.templateEngine || r;
						if (p.fb.ec(o, c, l), o = c.renderTemplate(o, a, s, l), "number" != typeof o.length || 0 < o.length && "number" != typeof o[0].nodeType) throw Error("Template engine must return an array of DOM nodes");
						switch (l = !1, t) {
							case "replaceChildren":
								p.f.T(e, o), l = !0;
								break;
							case "replaceNode":
								p.a.Lb(e, o), l = !0;
								break;
							case "ignoreTargetNode":
								break;
							default:
								throw Error("Unknown renderMode: " + t)
						}
						return l && (n(o, a), s.afterRender && p.k.B(s.afterRender, null, [o, a.$data])), o
					}
					var r;
					p.ab = function(t) {
						if (t != e && !(t instanceof p.H)) throw Error("templateEngine must inherit from ko.templateEngine");
						r = t
					}, p.Ya = function(t, n, a, s, l) {
						if (a = a || {}, (a.templateEngine || r) == e) throw Error("Set a template engine before calling renderTemplate");
						if (l = l || "replaceChildren", s) {
							var c = i(s);
							return p.j(function() {
								var e = n && n instanceof p.N ? n : new p.N(p.a.c(n)),
									r = p.C(t) ? t() : "function" == typeof t ? t(e.$data, e) : t,
									e = o(s, l, r, e, a);
								"replaceNode" == l && (s = e, c = i(s))
							}, null, {
								Ia: function() {
									return !c || !p.a.Ja(c)
								},
								o: c && "replaceNode" == l ? c.parentNode : c
							})
						}
						return p.D.Ua(function(e) {
							p.Ya(t, n, a, e, "replaceNode")
						})
					}, p.uc = function(t, i, r, a, s) {
						function l(e, t) {
							n(t, u), r.afterRender && r.afterRender(t, e)
						}

						function c(e, n) {
							u = s.createChildContext(e, r.as, function(e) {
								e.$index = n
							});
							var i = p.C(t) ? t() : "function" == typeof t ? t(e, u) : t;
							return o(null, "ignoreTargetNode", i, u, r)
						}
						var u;
						return p.j(function() {
							var t = p.a.c(i) || [];
							"undefined" == typeof t.length && (t = [t]), t = p.a.ta(t, function(t) {
								return r.includeDestroyed || t === e || null === t || !p.a.c(t._destroy)
							}), p.k.B(p.a.Za, null, [a, t, c, r, l])
						}, null, {
							o: a
						})
					};
					var a = p.a.e.F();
					p.d.template = {
						init: function(e, t) {
							var n = p.a.c(t());
							return "string" == typeof n || n.name ? p.f.ja(e) : (n = p.f.childNodes(e), n = p.a.oc(n), new p.r.fa(e).nodes(n)), {
								controlsDescendantBindings: !0
							}
						},
						update: function(t, n, i, o, r) {
							var s, l = n();
							n = p.a.c(l), i = !0, o = null, "string" == typeof n ? n = {} : (l = n.name, "if" in n && (i = p.a.c(n["if"])), i && "ifnot" in n && (i = !p.a.c(n.ifnot)), s = p.a.c(n.data)), "foreach" in n ? o = p.uc(l || t, i && n.foreach || [], n, t, r) : i ? (r = "data" in n ? r.createChildContext(s, n.as) : r, o = p.Ya(l || t, r, n, t)) : p.f.ja(t), r = o, (s = p.a.e.get(t, a)) && "function" == typeof s.K && s.K(), p.a.e.set(t, a, r && r.Z() ? r : e)
						}
					}, p.h.ha.template = function(e) {
						return e = p.h.Wa(e), 1 == e.length && e[0].unknown || p.h.lc(e, "name") ? null : "This template engine does not support anonymous templates nested within its templates"
					}, p.f.Q.template = !0
				}(), p.b("setTemplateEngine", p.ab), p.b("renderTemplate", p.Ya), p.a.wb = function(e, t, n) {
					if (e.length && t.length) {
						var i, o, r, a, s;
						for (i = o = 0;
							(!n || n > i) && (a = e[o]); ++o) {
							for (r = 0; s = t[r]; ++r)
								if (a.value === s.value) {
									a.moved = s.index, s.moved = a.index, t.splice(r, 1), i = r = 0;
									break
								}
							i += r
						}
					}
				}, p.a.Fa = function() {
					function e(e, t, n, i, o) {
						var r, a, s, l, c, u = Math.min,
							h = Math.max,
							d = [],
							f = e.length,
							m = t.length,
							g = m - f || 1,
							v = f + m + 1;
						for (r = 0; f >= r; r++)
							for (l = s, d.push(s = []), c = u(m, r + g), a = h(0, r - 1); c >= a; a++) s[a] = a ? r ? e[r - 1] === t[a - 1] ? l[a - 1] : u(l[a] || v, s[a - 1] || v) + 1 : a + 1 : r + 1;
						for (u = [], h = [], g = [], r = f, a = m; r || a;) m = d[r][a] - 1, a && m === d[r][a - 1] ? h.push(u[u.length] = {
							status: n,
							value: t[--a],
							index: a
						}) : r && m === d[r - 1][a] ? g.push(u[u.length] = {
							status: i,
							value: e[--r],
							index: r
						}) : (--a, --r, o.sparse || u.push({
							status: "retained",
							value: t[a]
						}));
						return p.a.wb(h, g, 10 * f), u.reverse()
					}
					return function(t, n, i) {
						return i = "boolean" == typeof i ? {
							dontLimitMoves: i
						} : i || {}, t = t || [], n = n || [], t.length <= n.length ? e(t, n, "added", "deleted", i) : e(n, t, "deleted", "added", i)
					}
				}(), p.b("utils.compareArrays", p.a.Fa),
				function() {
					function t(t, n, i, o, r) {
						var a = [],
							s = p.j(function() {
								var e = n(i, r, p.a.ka(a, t)) || [];
								0 < a.length && (p.a.Lb(a, e), o && p.k.B(o, null, [i, e, r])), a.length = 0, p.a.ga(a, e)
							}, null, {
								o: t,
								Ia: function() {
									return !p.a.ob(a)
								}
							});
						return {
							$: a,
							j: s.Z() ? s : e
						}
					}
					var n = p.a.e.F();
					p.a.Za = function(i, o, r, a, s) {
						function l(e, t) {
							w = h[t], v !== t && (C[e] = w), w.Na(v++), p.a.ka(w.$, i), m.push(w), b.push(w)
						}

						function c(e, t) {
							if (e)
								for (var n = 0, i = t.length; i > n; n++) t[n] && p.a.u(t[n].$, function(i) {
									e(i, n, t[n].sa)
								})
						}
						o = o || [], a = a || {};
						var u = p.a.e.get(i, n) === e,
							h = p.a.e.get(i, n) || [],
							d = p.a.Da(h, function(e) {
								return e.sa
							}),
							f = p.a.Fa(d, o, a.dontLimitMoves),
							m = [],
							g = 0,
							v = 0,
							y = [],
							b = [];
						o = [];
						for (var w, _, x, C = [], d = [], k = 0; _ = f[k]; k++) switch (x = _.moved, _.status) {
							case "deleted":
								x === e && (w = h[g], w.j && w.j.K(), y.push.apply(y, p.a.ka(w.$, i)), a.beforeRemove && (o[k] = w, b.push(w))), g++;
								break;
							case "retained":
								l(k, g++);
								break;
							case "added":
								x !== e ? l(k, x) : (w = {
									sa: _.value,
									Na: p.p(v++)
								}, m.push(w), b.push(w), u || (d[k] = w))
						}
						c(a.beforeMove, C), p.a.u(y, a.beforeRemove ? p.R : p.removeNode);
						for (var M, k = 0, u = p.f.firstChild(i); w = b[k]; k++) {
							for (w.$ || p.a.extend(w, t(i, r, w.sa, s, w.Na)), g = 0; f = w.$[g]; u = f.nextSibling, M = f, g++) f !== u && p.f.Bb(i, f, M);
							!w.ic && s && (s(w.sa, w.$, w.Na), w.ic = !0)
						}
						c(a.beforeRemove, o), c(a.afterMove, C), c(a.afterAdd, d), p.a.e.set(i, n, m)
					}
				}(), p.b("utils.setDomNodeChildrenFromArrayMapping", p.a.Za), p.O = function() {
					this.allowTemplateRewriting = !1
				}, p.O.prototype = new p.H, p.O.prototype.renderTemplateSource = function(e) {
					var t = (9 > p.a.L ? 0 : e.nodes) ? e.nodes() : null;
					return t ? p.a.S(t.cloneNode(!0).childNodes) : (e = e.text(), p.a.ba(e))
				}, p.O.Oa = new p.O, p.ab(p.O.Oa), p.b("nativeTemplateEngine", p.O),
				function() {
					p.Sa = function() {
						var e = this.kc = function() {
							if (!o || !o.tmpl) return 0;
							try {
								if (0 <= o.tmpl.tag.tmpl.open.toString().indexOf("__")) return 2
							} catch (e) {}
							return 1
						}();
						this.renderTemplateSource = function(t, i, r) {
							if (r = r || {}, 2 > e) throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
							var a = t.data("precompiled");
							return a || (a = t.text() || "", a = o.template(null, "{{ko_with $item.koBindingContext}}" + a + "{{/ko_with}}"), t.data("precompiled", a)), t = [i.$data], i = o.extend({
								koBindingContext: i
							}, r.templateOptions), i = o.tmpl(a, t, i), i.appendTo(n.createElement("div")), o.fragments = {}, i
						}, this.createJavaScriptEvaluatorBlock = function(e) {
							return "{{ko_code ((function() { return " + e + " })()) }}"
						}, this.addTemplate = function(e, t) {
							n.write("<script type='text/html' id='" + e + "'>" + t + "</script>")
						}, e > 0 && (o.tmpl.tag.ko_code = {
							open: "__.push($1 || '');"
						}, o.tmpl.tag.ko_with = {
							open: "with($1) {",
							close: "} "
						})
					}, p.Sa.prototype = new p.H;
					var e = new p.Sa;
					0 < e.kc && p.ab(e), p.b("jqueryTmplTemplateEngine", p.Sa)
				}()
		})
	}()
}()