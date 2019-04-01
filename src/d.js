/**
 * User: dingding <352926@qq.com>
 * Date: 2019-03-25
 * Time: 15:30
 */

if (typeof jQuery === 'undefined' && typeof Zepto === 'undefined') {
    throw new Error('D\'s JavaScript requires jQuery or Zepto')
}

//版本检测，以后或许用得到
+function ($) {
    'use strict';
    //var version = $.fn.jquery.split(' ')[0].split('.');
}($);

// d-tab
+function ($) {
    'use strict';

    var Tab = function (element) {
        this.element = $(element);
    };

    Tab.prototype.show = function () {
        var $this = this.element;
        var $div = $this.closest('.d-tab');
        var $ul = $this.closest('ul.d-tab-title');
        var selector = $this.attr('data-target');

        var $previous = $ul.find('li.active:last');

        $previous.trigger({
            type: 'hide.d.tab',
            relatedTarget: $this[0]
        });

        $this.trigger({
            type: 'show.d.tab',
            relatedTarget: $previous
        });

        if (!selector) {
            return;
        }
        $ul.find('li').removeClass('active');
        $this.addClass('active');
        $div.find('div.d-card-body').removeClass('d-show');

        var $target = $div.find('div.d-card-body' + selector.trim());
        $target.addClass('d-show');
    };

    var Plugin = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('d.tab');

            if (!data) $this.data('d.tab', (data = new Tab(this)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.tab = Plugin;

    var clickHandle = function () {
        Plugin.call($(this), 'show');
    };

    $(document).on('click', '.d-container .d-tab .d-tab-title li:not(.active)', clickHandle);
}($);

// checkbox 样式优化
+function ($) {
    'use strict';

    var Checkbox = function (element) {
        this.element = $(element);
    };

    Checkbox.prototype.init = function () {
        var $this = this.element;
        var $parent = $this.parent();
        if ($parent.hasClass('d-form-input-checkbox')) {
            // has initialized
            return false;
        }

        var checkbox = $this.prop('outerHTML');
        var placeholder = $this.attr('placeholder');
        var checked = $this.is(':checked');

        var $dom = $this;
        //判断上级是否是label.d-input-inline
        var label_name = '';
        if ($parent.hasClass('d-input-inline')) {
            label_name = $parent.text().trim();

            $dom = $parent;
        }

        if (placeholder === undefined) {
            placeholder = label_name;
        }

        $dom.before('<div class="d-form-input-checkbox ' + (checked ? ' checked' : '') + '"><i class="iconfont">' + (checked ? '&#xe60f;' : '&#xe605;') + '</i><span>' + placeholder + '</span>' + checkbox + '</div>');
        $dom.remove();
    };

    Checkbox.prototype.checked = function () {
        var $this = this.element;
        var $parent = $this.parent();

        if (!$parent.hasClass('d-form-input-checkbox')) {
            return false;
        }

        if ($parent.hasClass('checked')) {
            return true;
        }

        $parent.find('i.iconfont').html('&#xe60f;');
        $parent.addClass('checked');

        $this.trigger({
            type: 'change.d.checkbox'
        });

        $this.attr('checked', true);
        $this.prop('checked', true);
    };

    Checkbox.prototype.unchecked = function () {
        var $this = this.element;
        var $parent = $this.parent();

        if (!$parent.hasClass('d-form-input-checkbox')) {
            return false;
        }

        if (!$parent.hasClass('checked')) {
            return true;
        }

        $parent.find('i.iconfont').html('&#xe605;');
        $parent.removeClass('checked');

        $this.trigger({
            type: 'change.d.checkbox'
        });

        $this.removeAttr('checked');
    };

    Checkbox.prototype.click = function () {
        var $this = this.element;
        var $parent = $this.parent();

        if (!$parent.hasClass('d-form-input-checkbox')) {
            return false;
        }

        if ($parent.hasClass('checked')) {
            this.unchecked();
        } else {
            this.checked();
        }
    };

    var Plugin = function (option) {
        return this.each(function () {
            var $this = $(this);

            var data = $this.data('d.checkbox');
            if (!data) $this.data('d.checkbox', (data = new Checkbox(this)));
            if (typeof option == 'string') data[option]();
        });
    };

    var ClickHandle = function () {
        Plugin.call($(this).find('input[type=checkbox]:first'), 'click');
    };

    $(document).on('click', '.d-form-input-checkbox', ClickHandle);

    $('.d-container').find('input[type=checkbox]').each(function () {
        Plugin.call($(this), 'init');
    });

    $.fn.checkbox = Plugin;
}($);

// radio 样式优化
+function ($) {
    'use strict';

    var Radio = function (element) {
        this.element = $(element);
    };
    Radio.prototype.init = function () {
        var $this = this.element;
        var $parent = $this.parent();
        if ($parent.hasClass('d-form-input-radio')) {
            // has initialized
            return false;
        }

        var radio = $this.prop('outerHTML');
        var placeholder = $this.attr('placeholder');
        var checked = $this.is(':checked');

        var $dom = $this;
        //判断上级是否是label.d-input-inline
        var label_name = '';
        if ($parent.hasClass('d-input-inline')) {
            label_name = $parent.text().trim();

            $dom = $parent;
        }

        if (placeholder === undefined) {
            placeholder = label_name;
        }

        $dom.before('<div class="d-form-input-radio' + (checked ? ' checked' : '') + '"><i class="iconfont">' + (checked ? '&#xe76d;' : '&#xe623;') + '</i><span>' + placeholder + '</span>' + radio + '</div>');
        $dom.remove();

    };
    Radio.prototype.checked = function () {
        var $this = this.element;
        var $parent = $this.parent();

        if (!$parent.hasClass('d-form-input-radio')) {
            return false;
        }

        if ($parent.hasClass('checked')) {
            return true;
        }
        var radio_name = $this.attr('name');

        var $related = null;
        if (radio_name !== undefined) {
            var radios = $('.d-container input[type=radio][name=' + radio_name + ']');
            $.each(radios, function (i, j) {
                var $parent = $(j).parent();
                if ($parent.hasClass('d-form-input-radio') && $parent.hasClass('checked')) {
                    $related = $(j);
                    $parent.removeClass('checked');
                    $parent.find('i.iconfont').html('&#xe623;');
                    $(j).removeAttr('checked');
                }
            });
        }

        $this.trigger({
            type: 'change.d.radio',
            relatedTarget: $related
        });

        $parent.find('i.iconfont').html('&#xe76d;');
        $parent.addClass('checked');
        $this.attr('checked', true);
        $this.prop('checked', true);
    };
    Radio.prototype.unchecked = function () {
        var $this = this.element;
        var $parent = $this.parent();

        if (!$parent.hasClass('d-form-input-radio')) {
            return false;
        }

        $this.trigger({
            type: 'change.d.radio'
        });

        $parent.find('i.iconfont').html('&#xe623;');
        $parent.removeClass('checked');
        $this.removeAttr('checked');
    };

    var Plugin = function (option) {
        return this.each(function () {
            var $this = $(this);

            var data = $this.data('d.radio');
            if (!data) $this.data('d.radio', (data = new Radio(this)));
            if (typeof option == 'string') data[option]();
        });
    };

    var ClickHandle = function () {
        Plugin.call($(this).find('input[type=radio]:first'), 'checked');
    };

    $(document).on('click', '.d-form-input-radio', ClickHandle);
    $('.d-container').find('input[type=radio]').each(function () {
        Plugin.call($(this), 'init');
    });

    $.fn.radio = Plugin;
}($);

// select 组件
+function ($) {
    'use strict';

    var Select = function (element) {
        this.element = $(element);
    };

    Select.prototype.init = function () {
        var $this = this.element;

        var $parent = $this.parent();
        if ($parent.hasClass('d-form-select')) {
            // has initialized
            return false;
        }

        var select_html = $this.prop('outerHTML');
        var options = $this.children();
        var placeholder = '';
        var search = $this.attr('d-search') !== undefined;

        var select_group = false;

        var items = [];
        options.each(function () {
            var li_class = '';
            if (placeholder === '' && $(this).val() === '') {
                placeholder = $(this).html();
                li_class = 'select_tips';
            }

            if (this.tagName.toLowerCase() === 'optgroup') {
                select_group = true;
                items.push('<li class="group">' + $(this).attr('label') + '</li>');
                $(this).find('option').each(function () {
                    items.push('<li class="' + ($(this).is(':selected') ? ' active' : '') + '" data-value="' + $(this).val() + '">' + $(this).html() + '</li>');
                });

            } else {
                items.push('<li class="' + li_class + ($(this).is(':selected') ? ' active' : '') + '" data-value="' + $(this).val() + '">' + $(this).html() + '</li>');
            }

        });

        var ul = '<ul class="d-form-select-option' + (select_group ? ' d-form-select-group' : '') + '">' + items.join('') + '</ul>';

        var width = $this.css('width') !== '0px' ? 'width:' + $this.css('width') : '';
        var input = '<div class="d-form-select-title d-input-group">' +
            '<input type="text" placeholder="' + placeholder + '"' + (search ? '' : ' readonly') + ' value="" style="' + width + '">' +
            '<span class="d-input-group-addon"><i class="iconfont">&#xe843;</i></span></div>';
        var html = '<div class="d-form-select">' + input + ul + select_html + '</div>';

        $this.before(html);
        $this.remove();
    };

    Select.prototype.show = function () {
        var $this = this.element;
        var $icon = $this.parent().find('.d-input-group-addon i.iconfont');
        var $option = $this.parent().find('.d-form-select-option');

        $this.addClass('open');
        $icon.html('&#xe844;');
        $option.show();
    };

    Select.prototype.hide = function () {
        var $this = this.element;
        var $icon = $this.parent().find('.d-input-group-addon i.iconfont');
        var $option = $this.parent().find('.d-form-select-option');

        $this.removeClass('open');
        $icon.html('&#xe843;');
        $option.hide();
    };

    Select.prototype.click = function () {
        var $this = this.element;

        if ($this.hasClass('open')) {
            //已经打开
            console.log('a');
            this.hide();
        } else {
            console.log('b');
            this.show();
        }
    };

    var Plugin = function (option) {
        return this.each(function () {
            var $this = $(this);

            var data = $this.data('d.select');
            if (!data) $this.data('d.select', (data = new Select(this)));
            if (typeof option == 'string') data[option]();
        });
    };
    $.fn.select = Plugin;

    var ClickHandle = function (e) {
        var $select = $(this).closest('.d-form-select');

        Plugin.call($select.find('select:first'), 'click');
        $('.d-container').one('click', function () {
            Plugin.call($('.d-container').find('.d-form-select select'), 'hide');
        });
        e.stopPropagation();
    };

    $(document).on('click', '.d-form-select input', ClickHandle);
    $(document).on('click', '.d-form-select input', ClickHandle);

    $('.d-container').find('select').each(function () {
        Plugin.call($(this), 'init');
    });
}($);
