// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

// knockout-sortable 0.8.5 | (c) 2014 Ryan Niemeyer | http://www.opensource.org/licenses/mit-license
!function(a){"function"==typeof define&&define.amd?define(["knockout","jquery","jquery.ui.sortable"],a):a(window.ko,jQuery)}(function(a,b){var c="ko_sortItem",d="ko_sourceIndex",e="ko_sortList",f="ko_parentList",g="ko_dragItem",h=a.utils.unwrapObservable,i=a.utils.domData.get,j=a.utils.domData.set,k=function(b,d){a.utils.arrayForEach(b,function(a){1===a.nodeType&&(j(a,c,d),j(a,f,i(a.parentNode,e)))})},l=function(b,c){var d,e={},f=h(b());return f.data?(e[c]=f.data,e.name=f.template):e[c]=b(),a.utils.arrayForEach(["afterAdd","afterRender","as","beforeRemove","includeDestroyed","templateEngine","templateOptions"],function(b){e[b]=f[b]||a.bindingHandlers.sortable[b]}),"foreach"===c&&(e.afterRender?(d=e.afterRender,e.afterRender=function(a,b){k.call(b,a,b),d.call(b,a,b)}):e.afterRender=k),e},m=function(a,b){var c=h(b);if(c)for(var d=0;a>d;d++)c[d]&&h(c[d]._destroy)&&a++;return a};a.bindingHandlers.sortable={init:function(k,n,o,p,q){var r,s,t=b(k),u=h(n())||{},v=l(n,"foreach"),w={};t.contents().each(function(){this&&1!==this.nodeType&&k.removeChild(this)}),b.extend(!0,w,a.bindingHandlers.sortable),u.options&&w.options&&(a.utils.extend(w.options,u.options),delete u.options),a.utils.extend(w,u),w.connectClass&&(a.isObservable(w.allowDrop)||"function"==typeof w.allowDrop)?a.computed({read:function(){var b=h(w.allowDrop),c="function"==typeof b?b.call(this,v.foreach):b;a.utils.toggleDomNodeCssClass(k,w.connectClass,c)},disposeWhenNodeIsRemoved:k},this):a.utils.toggleDomNodeCssClass(k,w.connectClass,w.allowDrop),a.bindingHandlers.template.init(k,function(){return v},o,p,q),r=w.options.start,s=w.options.update;var x=setTimeout(function(){var l;t.sortable(a.utils.extend(w.options,{start:function(b,c){var e=c.item[0];j(e,d,a.utils.arrayIndexOf(c.item.parent().children(),e)),c.item.find("input:focus").change(),r&&r.apply(this,arguments)},receive:function(a,b){l=i(b.item[0],g),l&&(l.clone&&(l=l.clone()),w.dragged&&(l=w.dragged.call(this,l,a,b)||l))},update:function(g,h){var k,n,o,p,q,r=h.item[0],t=h.item.parent()[0],u=i(r,c)||l;if(l=null,u&&(this===t||b.contains(this,t))){if(k=i(r,f),o=i(r,d),n=i(r.parentNode,e),p=a.utils.arrayIndexOf(h.item.parent().children(),r),v.includeDestroyed||(o=m(o,k),p=m(p,n)),(w.beforeMove||w.afterMove)&&(q={item:u,sourceParent:k,sourceParentNode:k&&h.sender||r.parentNode,sourceIndex:o,targetParent:n,targetIndex:p,cancelDrop:!1}),w.beforeMove&&(w.beforeMove.call(this,q,g,h),q.cancelDrop))return q.sourceParent?b(q.sourceParent===q.targetParent?this:h.sender).sortable("cancel"):b(r).remove(),void 0;p>=0&&(k&&(k.splice(o,1),a.processAllDeferredBindingUpdates&&a.processAllDeferredBindingUpdates()),n.splice(p,0,u)),j(r,c,null),h.item.remove(),a.processAllDeferredBindingUpdates&&a.processAllDeferredBindingUpdates(),w.afterMove&&w.afterMove.call(this,q,g,h)}s&&s.apply(this,arguments)},connectWith:w.connectClass?"."+w.connectClass:!1})),void 0!==w.isEnabled&&a.computed({read:function(){t.sortable(h(w.isEnabled)?"enable":"disable")},disposeWhenNodeIsRemoved:k})},0);return a.utils.domNodeDisposal.addDisposeCallback(k,function(){t.data("sortable")&&t.sortable("destroy"),clearTimeout(x)}),{controlsDescendantBindings:!0}},update:function(b,c,d,f,g){var h=l(c,"foreach");j(b,e,h.foreach),a.bindingHandlers.template.update(b,function(){return h},d,f,g)},connectClass:"ko_container",allowDrop:!0,afterMove:null,beforeMove:null,options:{}},a.bindingHandlers.draggable={init:function(c,d,e,f,i){var k=h(d())||{},m=k.options||{},n=a.utils.extend({},a.bindingHandlers.draggable.options),o=l(d,"data"),p=k.connectClass||a.bindingHandlers.draggable.connectClass,q=void 0!==k.isEnabled?k.isEnabled:a.bindingHandlers.draggable.isEnabled;return k=k.data||k,j(c,g,k),a.utils.extend(n,m),n.connectToSortable=p?"."+p:!1,b(c).draggable(n),void 0!==q&&a.computed({read:function(){b(c).draggable(h(q)?"enable":"disable")},disposeWhenNodeIsRemoved:c}),a.bindingHandlers.template.init(c,function(){return o},e,f,i)},update:function(b,c,d,e,f){var g=l(c,"data");return a.bindingHandlers.template.update(b,function(){return g},d,e,f)},connectClass:a.bindingHandlers.sortable.connectClass,options:{helper:"clone"}}});
