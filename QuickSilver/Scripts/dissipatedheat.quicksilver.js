/*
    http://www.dissipatedheat.com
*/

/*
    Source: http://rails-oceania.googlecode.com/svn/lachiecox/qs_score/trunk/qs_score.js
    */

dissipatedheat = {};
dissipatedheat.quicksilver = {};
dissipatedheat.quicksilver.score = function (data, abbreviation, offset, caseSensitive) {
    offset = offset || 0
    caseSensitive = caseSensitive || false;

    if (abbreviation == null || abbreviation == undefined) return 0.9;
    if (abbreviation.length == 0) return 0.9
    if (abbreviation.length > data.length) return 0.0

    for (var i = abbreviation.length; i > 0; i--) {
        var sub_abbreviation = abbreviation.substring(0, i)
        var index = data.indexOf(sub_abbreviation)


        if (index < 0) continue;
        if (index + abbreviation.length > data.length + offset) continue;

        var next_string = data.substring(index + sub_abbreviation.length)
        var next_abbreviation = null

        if (i >= abbreviation.length)
            next_abbreviation = ''
        else
            next_abbreviation = abbreviation.substring(i)

        var remaining_score = dissipatedheat.quicksilver.score(next_string, next_abbreviation, offset + index, caseSensitive)

        if (remaining_score > 0) {
            var score = data.length - next_string.length;

            if (index != 0) {
                var j = 0;

                var c = data.charCodeAt(index - 1)
                if (c == 32 || c == 9) {
                    for (var j = (index - 2) ; j >= 0; j--) {
                        c = data.charCodeAt(j)
                        score -= ((c == 32 || c == 9) ? 1 : 0.15)
                    }
                } else {
                    score -= index
                }
            }

            score += remaining_score * next_string.length
            score /= data.length;
            return score
        }
    }
    return 0.0
}


/*
    Source: http://orderedlist.com/blog/articles/live-search-with-quicksilver-style-for-jquery/
    http://ejohn.org/blog/jquery-livesearch/
*/

$.fn.quicksilver = function (list, showFunc, hideFunc) {
    list = jQuery(list);
    if (list.length) {
        var rows = list.children('li'),
          cache = rows.map(function () {
              return this.innerHTML.toLowerCase();
          });

        this
          .keyup(filter).keyup()
          .parents('form').submit(function () {
              return false;
          });
    }

    return this;

    function filter() {
        var term = jQuery.trim(jQuery(this).val().toLowerCase()), scores = [];

        cache.each(function (i) {
            var score = dissipatedheat.quicksilver.score(this, term);
            if (score > 0) {
                scores.push([score, i]);
            }
            else {
                hide(rows[i]);
            }
        });

        jQuery.each(scores.sort(function (a, b) { return b[0] - a[0]; }), function () {
            show(rows[this[1]]);
        });
    }


    function show(item) {
        if (showFunc != null && showFunc != undefined) {
            showFunc($(item));
        }
        else {
            $(item).show('fast', 'easeInQuart');
        }
    }

    function hide(item) {
        if (hideFunc != null && hideFunc != undefined) {
            hideFunc($(item));
        }
        else {
            $(item).hide('fast', 'easeOutQuart');
        }
    }
};