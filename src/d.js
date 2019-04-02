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
            '<input type="text" class="d-form-select-input" placeholder="' + placeholder + '"' + (search ? '' : ' readonly') + ' value="" style="' + width + '">' +
            '<span class="d-input-group-addon"><i class="iconfont">&#xe843;</i></span></div>';
        var html = '<div class="d-form-select">' + input + ul + select_html + '</div>';

        $this.before(html);
        $this.remove();

        $('body').find('.d-container .d-form-select .d-form-select-input').unbind('keydown').keydown(function (e) {
            var $self = $(this);
            var $parent = $self.parent().parent();
            if (!$parent.find('.d-form-select-option').is(':visible')) {
                //面板没有打开就返回
                $self.blur();
                return false;
            }

            switch (e.keyCode) {
                case 38:
                case 40:
                case 13:
                    if (!$parent.hasClass('d-form-select')) {
                        //非本组件不生效
                        return false;
                    }

                    var $select_option = $parent.find('.d-form-select-option li.active');

                    if (e.keyCode === 38) {
                        //上
                        var $prev_option = $select_option.prevAll(':not(.group):not(.d-hide):first');
                        if ($prev_option && $prev_option.length > 0) {
                            $select_option.removeClass('active');
                            $prev_option.addClass('active')
                        }
                    } else if (e.keyCode === 40) {
                        //下
                        var $next_option = $select_option.nextAll(':not(.group):not(.d-hide):first');
                        if ($next_option && $next_option.length > 0) {
                            $select_option.removeClass('active');
                            $next_option.addClass('active');
                        }
                    } else if (e.keyCode === 13) {
                        //回车
                        $parent.find('select:first').select('val', $select_option.attr('data-value'));
                        $self.blur();
                    }

                    return false;
            }
        });

        $('body').find('.d-container .d-form-select .d-form-select-input').unbind('keyup').keyup(function (e) {
            var $self = $(this);
            var $parent = $self.parent().parent();
            if (!$parent.hasClass('d-form-select')) {
                //非本组件不生效
                return false;
            }

            if (!$parent.find('.d-form-select-option').is(':visible')) {
                //面板没有打开就返回
                return false;
            }

            var search = $self.attr('readonly') === undefined;
            if (search) {
                //需要搜索
                var value = $self.val();

                var $options = $parent.find('.d-form-select-option li:not(.group)');

                var has_result = false;
                $options.each(function () {
                    if ($(this).text().indexOf(value) !== -1) {
                        $(this).removeClass('d-hide');
                        has_result = true;
                    } else {
                        $(this).addClass('d-hide');
                    }
                });

                if (has_result === false) {
                    $parent.find('.d-form-select-option').append('<li class="not_matched">无匹配项</li>');
                }
            }
        });
    };

    Select.prototype.show = function () {
        var $this = this.element;
        var $icon = $this.parent().find('.d-input-group-addon i.iconfont');
        var $options = $this.parent().find('.d-form-select-option');

        $this.addClass('open');
        $icon.html('&#xe844;');
        $options.show();
    };

    Select.prototype.hide = function () {
        var $this = this.element;
        var $parent = $this.parent();
        var $icon = $parent.find('.d-input-group-addon i.iconfont');
        var $options = $this.parent().find('.d-form-select-option');
        $options.find('li.d-hide').removeClass('d-hide');
        $options.find('li.not_matched').remove();

        var input_value = $parent.find('input.d-form-select-input').val();

        if (input_value.trim().length > 0) {
            var reset = true;
            $options.each(function () {
                if ($(this).text() === input_value) {
                    reset = false;
                }
            });

            if (reset) {
                var v = $options.find('li.active').attr('data-value') !== '' ? $options.find('li.active').text() : '';
                $parent.find('input.d-form-select-input').val(v).blur();
            }
        }

        $this.removeClass('open');
        $icon.html('&#xe843;');
        $options.hide();
    };

    Select.prototype.click = function () {
        var $this = this.element;

        if ($this.hasClass('open')) {
            //已经打开
            this.hide();
        } else {
            this.show();
        }
    };

    Select.prototype.val = function (value) {
        var $this = this.element;
        var $parent = $this.parent();

        if (!$parent.hasClass('d-form-select')) {
            return false;
        }

        var $options = $parent.find('.d-form-select-option');
        $this.val(value);

        $options.find('li:not(.group)').each(function () {
            var $li = $(this);
            if ($li.attr('data-value') === value) {
                $li.addClass('active');
                $parent.find('input[type=text]').val(value === '' ? '' : $li.text());
            } else {
                $li.removeClass('active');
            }
        });
        $this.change();

        this.hide();
    };

    var Plugin = function (option, value) {
        return this.each(function () {
            var $this = $(this);

            var data = $this.data('d.select');
            if (!data) $this.data('d.select', (data = new Select(this)));
            if (typeof option == 'string') data[option](value);
        });
    };
    $.fn.select = Plugin;

    var ClickHandle = function (e) {
        var $this = $(this);
        var $select = $this.closest('.d-form-select');

        Plugin.call($select.find('select:first'), 'click');

        $('.d-container').one('click', function (ev) {
            if (e.target !== ev.target) {
                Plugin.call($('.d-container').find('.d-form-select select.open'), 'hide');
            }
        });
        e.stopPropagation();
    };

    $(document).on('click', '.d-container .d-form-select-title', ClickHandle);
    $(document).on('click', '.d-container .d-form-select-option li', function () {
        var value = $(this).attr('data-value');
        var $select = $(this).parent().parent().find('select:first');
        Plugin.call($select, 'val', value);
    });


    // $('body').find('.d-container .d-form-select').find('input').keydown(function (e) {
    //     console.log(e.keyCode);
    //     if (e.keyCode === 38) {
    //         //
    //     }
    // });
    // $(document).keydown(function (e) {
    //     console.log(e.keyCode);
    //     return false;
    // });
    // $("input").keydown(function () {
    //     $("input").css("background-color", "#FFFFCC");
    // });
    // $("input").keyup(function () {
    //     $("input").css("background-color", "#D6D6FF");
    // });
    $('.d-container').find('select').each(function () {
        Plugin.call($(this), 'init');
    });
}($);
