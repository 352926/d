/**
 * User: dingding <352926@qq.com>
 * Date: 2019-05-27
 * Time: 10:53
 */

+function ($) {
    'use strict';

    var Frame = function (element) {
        this.element = $(element);
    };

    Frame.prototype.open = function (option) {
        if (option.href === undefined || option.href.length === 0) {
            return false;
        }

        var $this = this.element;

        $this.find('iframe').hide();

        var id = null;
        var rand_id = 'id_' + (new Date() / 1) + '_' + (Math.random() * 10000000000).toFixed(0);

        if (option.id !== undefined && option.id.length > 0) {
            id = option.id;
        } else if (option.menu_id !== undefined && option.menu_id.length > 0) {
            $tab = this.findTabByMenuId(option.menu_id);
            if ($tab === false) {
                id = rand_id;
            } else {
                id = $tab.attr('d-id');
            }
        } else {
            id = rand_id;
        }

        $iframe = $this.find('iframe[d-id="' + id + '"]');
        if ($iframe.length > 0) {
            $iframe.attr('src', option.href);
            $iframe.show();

            this.selectTab(id, open.title, open.icon);
        } else {
            var title = option.title === undefined ? option.href : option.title;
            var desc = option.desc === undefined ? '' : option.desc;
            //内部关联tab和iframe的唯一码
            var $tab = this.createTab(id, option.menu_id, title, option.icon, desc, true, true);
            var d_id = option.menu_id !== undefined && option.menu_id.length > 0 ? ' d-id="' + option.menu_id + '" ' : '';

            var $iframe = $('<iframe d-id="' + id + '" ' + d_id + ' src="' + option.href + '" frameborder="0"></iframe>');
            $iframe.appendTo($this);

            if (option.title === undefined) {
                //没有标题，则等iframe 加载完后获取页面title
                var iframe = $iframe[0];
                if (iframe.attachEvent) {
                    iframe.attachEvent('onload', function () {
                        //iframe加载完成后
                        $tab.children('span').html(iframe.contentWindow.document.title);
                    });
                } else {
                    iframe.onload = function () {
                        $tab.children('span').html(iframe.contentWindow.document.title);
                    };
                }
            }
        }
    };

    Frame.prototype.closeFrame = function (id) {
        var $this = this.element;
        var $iframe = $this.find('iframe[d-id="' + id + '"]');
        $iframe.remove();
    };

    /**
     * 刷新id对应的iframe
     * @param id
     */
    Frame.prototype.refresh = function (id) {
        var $this = this.element;
        var $iframe = $this.find('iframe[d-id="' + id + '"]');
        if ($iframe.length > 0) {
            $iframe[0].contentWindow.location.reload(true);
        }
    };

    /**
     * 选中tab并且显示对应的iframe
     * @param id
     */
    Frame.prototype.select = function (id) {
        var $this = this.element;
        $this.find('iframe').hide();
        var $iframe = $this.find('iframe[d-id="' + id + '"]');

        if ($iframe.length > 0) {
            $iframe.show();
            var $tab = this.selectTab(id);

            if ($tab !== false) {
                var menu_id = $tab.attr('d-menu-id');
                $('.d-menu-item li').removeClass('active');
                if ($('.d-menu').find('.d-menu-item li > a[d-menu-id="' + menu_id + '"]').length > 0) {
                    $('.d-menu').find('.d-menu-item li > a[d-menu-id="' + menu_id + '"]').parent().addClass('active');
                }
            }
            return true;
        } else {
            return false;
        }
    };

    /**
     * 仅仅只是选中tab，不会操作iframe
     * @param id
     * @param title 默认不更改，如果指定则选中的同时会更改tab标题
     * @param icon
     */
    Frame.prototype.selectTab = function (id, title, icon) {
        var $ul = $('.d-frame-tabs .d-frame-tabs-center ul.d-tabs-title');
        var $curr = $ul.find('li[d-id="' + id + '"]');
        if ($curr.length > 0) {
            $ul.find('li.active').removeClass('active');
            $curr.addClass('active');
            var title_html = '';
            if (title === undefined) {
                title_html = $curr.children('span').html();
            }
            if (icon !== undefined) {
                title_html = icon + title_html;
            }

            $curr.children('span').html(title_html);
            return $curr;
        }
        return false;
    };

    Frame.prototype.findTabByMenuId = function (menu_id) {
        var $ul = $('.d-frame-tabs .d-frame-tabs-center ul.d-tabs-title');
        var $curr = $ul.find('li[d-menu-id="' + menu_id + '"]:first');
        if ($curr.length > 0) {
            return $curr;
        }
        return false;
    };

    /**
     * 创建tab
     * @param id 唯一值，用于tab+iframe绑定的唯一值，在创建Frame.open的时候创建的唯一值
     * @param menu_id 菜单id，对应的是菜单里的d-id
     * @param title
     * @param icon
     * @param desc 鼠标移动至标签上提示文案（供超出长度隐藏而显示的值）
     * @param selected boolean 默认true 是否选中
     * @param btn_close boolean 默认true 是否显示关闭按钮
     */
    Frame.prototype.createTab = function (id, menu_id, title, icon, desc, selected, btn_close) {
        var $ul = $('.d-frame-tabs .d-frame-tabs-center ul.d-tabs-title');
        selected = selected === undefined ? true : selected;
        btn_close = btn_close === undefined ? true : btn_close;
        icon = icon === undefined ? '' : icon;

        var $tab = $('<li title="' + desc + '"><span>' + icon + title + '</span></li>');
        if (id !== undefined && id.length > 0) {
            $tab.attr('d-id', id);
        }
        if (menu_id !== undefined && menu_id.length > 0) {
            $tab.attr('d-menu-id', menu_id);
        }

        if (selected === true) {
            $ul.find('li.active').removeClass('active');
            $tab.addClass('active');
        }

        if (btn_close === true) {
            $('<i class="iconfont d-icon-close"></i>').appendTo($tab);
        }

        $tab.appendTo($ul);

        return $tab;
    };

    var Plugin = function (method, option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('d.frame');

            if (!data) $this.data('d.frame', (data = new Frame(this)));
            if (typeof method === 'string') data[method](option);
        });
    };

    $.fn.frame = Plugin;

    $('.d-frame-tabs').on('click', '.d-tabs-title>li:not(.active)>span', function () {
        var $dframe = $('.d-iframe');
        var $current_li = $(this).closest('li');
        var id = $current_li.attr('d-id');

        if (id === undefined || id.length === 0) {
            return;
        }

        $dframe.frame('select', id);
    }).on('click', '.d-tabs-title .d-icon-close', function () {
        var $current_li = $(this).closest('li');
        var id = $current_li.attr('d-id');

        var $dframe = $('.d-iframe');
        if ($current_li.hasClass('active')) {
            var $tabs = $(this).closest('.d-tabs-title');

            $tabs.find('li').removeClass('active');
            var $prev = $current_li.prev();

            $prev.addClass('active');
            var prev_id = $prev.attr('d-id');
            $dframe.frame('select', prev_id);
        }

        $current_li.remove();
        $dframe.frame('closeFrame', id);
    });
}(jQuery);