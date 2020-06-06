/**
 * AJAX functions for the pagename quicksearch
 *
 * @license  GPL2 (http://www.gnu.org/licenses/gpl.html)
 * @author   Paolo Maggio <maggio.p@gmail.com>
 * @author   Håkan Sandell <sandell.hakan@gmail.com>
 * @author   Trailjeep <trailjeep@gmail.com>
 */

var twistienav4bootstrap3_plugin = {

    $callerObj: null,

    init: function () {
	var $match = 0;
console.log('x');
        if ((JSINFO['conf']['breadcrumbs'] > 0) && (jQuery('div.dw__breadcrumbs').length !== 0)) {
            twistienav4bootstrap3_plugin.breadcrumbs('div.dw__breadcrumbs', 'bc_ns');
			$match++;
        }
        if ((JSINFO['conf']['youarehere'] == 1) && (jQuery('div.dw__youarehere').length !== 0)) {
            twistienav4bootstrap3_plugin.breadcrumbs('div.dw__youarehere', 'yah_ns');
			$match++;
        }
        if ((JSINFO['plugin_twistienav4bootstrap3']['pit_skeleton'] != null) && (jQuery('.pageId').length !== 0)) {
            twistienav4bootstrap3_plugin.pageIdTrace('.pageId', 'yah_ns');
        }

        return;
    },

    /**
     * Add twisties and link events 
     */
    breadcrumbs: function(div, ns_list){
        var do_search;
        var $traceObj = jQuery(div);
        var $list = JSINFO['plugin_twistienav4bootstrap3'][ns_list];

        jQuery(document).click(function(e) {
            twistienav4bootstrap3_plugin.clear_results();
        });
        
        do_search = function (caller, namespace) {
            twistienav4bootstrap3_plugin.$callerObj = jQuery(caller);
            jQuery.post(
                DOKU_BASE + 'lib/exe/ajax.php',
                {
                    call: 'plugin_twistienav4bootstrap3',
                    idx: encodeURI(namespace)
                },
                twistienav4bootstrap3_plugin.onCompletion,
                'html'
            );
        };

        // add new twisties
        var linkNo = 0;
        $links = $traceObj.find('a');
        $links.each(function () {
            var ns = $list[linkNo];
            if (ns == false) {
                ns = '';
            }
            if ($list[linkNo] || $list[linkNo] == '') {
                var $classes = 'twistienav_twistie' + ' ' + JSINFO['plugin_twistienav4bootstrap3']['style'];
                if ((JSINFO['plugin_twistienav4bootstrap3']['twistiemap'] == 1) && (ns == '')) {
                    $classes = 'twistienav_map' + ' ' + JSINFO['plugin_twistienav4bootstrap3']['style'];
                }
                jQuery(document.createElement('span'))
                            .addClass($classes)
                            .show()
                            .insertAfter(jQuery(this))
                            .click(function() {
                                twistie_active = jQuery(this).hasClass('twistienav_down'); 
                                twistienav4bootstrap3_plugin.clear_results();
                                if (!twistie_active) {
                                    do_search(this, ns);
                                }
                            });
            }
            linkNo++;
        });
    },

    /**
     * Turn 'pageId' element into a minimalistic hierarchical trace
     */
    pageIdTrace: function(div, ns_list){
        var do_search;
        var $traceObj = jQuery(div);
        var $list = JSINFO['plugin_twistienav4bootstrap3'][ns_list];

        jQuery(document).click(function(e) {
            twistienav4bootstrap3_plugin.clear_results();
        });
        
        do_search = function (caller, namespace) {
            twistienav4bootstrap3_plugin.$callerObj = jQuery(caller);
            jQuery.post(
                DOKU_BASE + 'lib/exe/ajax.php',
                {
                    call: 'plugin_twistienav4bootstrap3_pageid',
                    idx: encodeURI(namespace)
                },
                twistienav4bootstrap3_plugin.onCompletion,
                'html'
            );
        };

        // Replace pageId text by prepared skeleton
        $traceObj.html(JSINFO['plugin_twistienav4bootstrap3']['pit_skeleton']);

        // transform links into text "twisties"
        var linkNo = 1;
        $links = $traceObj.find('a');
        $links.each(function () {
            var ns = $list[linkNo];
            if (ns == false) {
                ns = '';
            }
            if ($list[linkNo] || $list[linkNo] == '') {
                jQuery(this)
                            .addClass('twistienav_twistie')
                            .show()
                            .insertAfter(this)
                            .click(function() {
                                twistie_active = jQuery(this).hasClass('twistienav_down'); 
                                twistienav4bootstrap3_plugin.clear_results();
                                if (!twistie_active) {
                                    do_search(this, ns);
                                }
                            });
            } else {
                jQuery(this)
                            .addClass('twistienav_twistie')
                            .show()
                            .insertAfter(this)
                            .click(function() {
                                twistie_active = jQuery(this).hasClass('twistienav_down'); 
                                twistienav4bootstrap3_plugin.clear_results();
                                if (!twistie_active) {
                                    do_search(this, '');
                                }
                            });
            }
            linkNo++;
        });
    },

    /**
     * Remove output div
     */
    clear_results: function(){
        jQuery('.twistienav_twistie').removeClass('twistienav_down');
        jQuery('.twistienav_map').removeClass('twistienav_down');
        jQuery('#twistienav__popup').remove();
    },

    /**
     * Callback. Reformat and display the results.
     *
     * Namespaces are shortened here to keep the results from overflowing
     * or wrapping
     *
     * @param data The result HTML
     */
    onCompletion: function(data) {
        var pos = twistienav4bootstrap3_plugin.$callerObj.position();

        if (data === '') { return; }

        twistienav4bootstrap3_plugin.$callerObj.addClass('twistienav_down');

        jQuery(document.createElement('div'))
                        .html(data)
                        .attr('id','twistienav__popup')
                        .css({
                            'position':    'absolute'
                        })
                        .appendTo("body")
                        .position({
                            "my": "left top",
                            "at": "right bottom",
                            "of": twistienav4bootstrap3_plugin.$callerObj,
                            "collision": "flipfit"
                        })
                        .click(function() {
                            twistienav4bootstrap3_plugin.clear_results();
                        });
    }
};

jQuery(function () {
    twistienav4bootstrap3_plugin.init();
});
// vim: set fileencoding=utf-8 expandtab ts=4 sw=4 :
