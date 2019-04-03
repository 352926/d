

## 用法

```
初衷：d.css 提供了 box、table、tab、form、iconfont 一些基础的样式美化。也就几行代码，但这些就够了，解决了每次写样式的痛苦，更适合一名后端来写页面（关键是设计页面）。
```

#### 基础样式

新页面最好引入CSS重置样式库，https://necolas.github.io/normalize.css/8.0.1/normalize.css 以增强跨浏览器表现的一致性。



为了保证不与其它样式冲突，必须要在d-container里面才生效

如：

```
<div class="d-container">
    you code here
    //后面所有样式都必须在d-container里面才生效
</div>
```

#### 栅格系统

跟bootstrap类似但更简单，其实这里定义为box（盒子），可以想象下把页面里功能块当做一个个盒子来排版。前提是得放在d-row的样式里。

```
<div class="d-row">
    <div class="d-box d-box-2"></div>
    <div class="d-box d-box-1"></div>
    <div class="d-box d-box-3"></div>
    <div class="d-box d-box-6"></div>
</div>
```

其中 .d-box-xx 代表宽度占用比，xx为1-12的数字，把一行分成12份。超过会自动换行展示。

.d-box下有.d-card样式，可以理解为用来盛放内容的卡片容器

.d-card下有 .d-card-tools (工具图标) .d-card-header(标题内容) .d-card-body(功能内容) 三个主要样式

```
<div class="d-row">
    <div class="d-box d-box-12">
        <div class="d-card">
        	<div class="d-card-tools">
        		<i class="iconfont">&#xe6e9;</i>
        	</div>
            <div class="d-card-header d-div-overflow">
                .d-card-header 为标题样式<br>
                .d-div-overflow 为标题超出长度用...代替样式
            </div>
            <div class="d-card-body">
                这里是用来存放内容的。样式可以自由开发，默认设置了最大高度245px，超出会自动出现上下滚动条
            </div>
        </div>
    </div>
</div>
```



#### Tab示例

tab 也是基于 .d-box .d-card样式下的。

```
<div class="d-box d-box-12">
    <div class="d-card">
        <div class="d-tab">
            <ul class="d-tab-title">
                <li class="active" data-target=".top-search">今日热搜</li>
                <li data-target=".top-access">top访问</li>
            </ul>
            <div class="d-card-body d-show top-search">
            	这里是今日热搜内容
            </div>
            <div class="d-card-body top-access">
            	这里是TOP访问内容
            </div>
        </div>
    </div>
</div>
```

其中，.d-tab-title下li的data-target属性值为面板对应标识，可以以.开头的样式标识，也可以以#开头的id标识。但面板代码必须在div.d-tab 里面，同时设置.d-card-body样式。请不要改变demo里的样式层级。

关于Tab事件

```
//绑定某Tab页被隐藏事件
$('.d-tab [data-target=".top-search"]').on('hide.d.tab', function (e) {
	console.log('被隐藏', $(this), e);
});
//绑定某Tab页被显示事件
$('.d-tab [data-target=".top-search"]').on('show.d.tab', function (e) {
    console.log('被显示', $(this), e);
});
//通过jQuery显示某一指定Tab页
$('.d-tab [data-target=".top-search"]').tab('show')

```





#### Table示例

表格在原生table的基础上，只需引入 d-table 样式即可。

```
<table class="d-table">
    <colgroup>
        <col width="150">
        <col width="150">
        <col width="200">
        <col>
    </colgroup>
    <thead>
        <tr>
            <th>标题</th>
            <th>描述</th>
            <th>创建时间</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>这是一个标题</td>
        <td>这是一个描述</td>
        <td>2019-03-26</td>
        <td>删除</td>
    </tr>
    </tbody>
</table>
```

d-table-hover，鼠标悬停样式

```
<table class="d-table d-table-hover">
  ...
</table>
```

#### Checkbox Radio Select 组件

如果引入d.js，则会自动美化input checkbox和radio组件，因此以下事件你不得不了解。这也算是修复bootstrap上的一些不足吧。

##### .radio(option) ，option值有 (checked|unchecked|init)

如果你有一个radio组件是通过js二次渲染的，想要有d.css的样式，那么可以通过 $('xx').radio('init') 来初始化。

```
$('input[name=input_radio]:not(:checked)').radio('checked') //选中未选中的(多个的话选中最后一个)
$('input[name=input_radio]:checked').radio('unchecked') //取消已经选中的
$($('input[name=input_radio]')[0]).radio('checked') //选中第一个(已选中则取消)
$('input[name=input_radio]:checked').val()
```

##### .checkbox(option)，用法与radio同出一辙。option值有 (checked|unchecked|init)

##### 绑定onChange事件

```
$('input[name=radio_aaa]').on('change.d.radio', function (e) {
    console.log('radio 值被改变', e, this);
});

$('input[name=checkbox_aaa]').on('change.d.checkbox', function (e) {
    console.log('checkbox 值被改变', e, this);
});
```

##### html写法

以下效果一样，区别在于，如果引入d.js，则"钢铁侠"选项会自动读取placeholder里的值做为label内容做为此radio的说明。而"蜘蛛侠"选项则无论是否引入js，都会有一个默认样式（为了提升性能，你或许不想引入js，可以按照第二种写法来写）

```
<input type="checkbox" name="cb" value="钢铁侠" placeholder="钢铁侠">
<label class="d-input-inline">
    <input type="checkbox" name="cb" checked value="蜘蛛侠"> 蜘蛛侠
</label>
```

##### Select 用法

html详细写法请参考 demo https://ding.uq0.com/d/demo.html
引入d.js将自动渲染，渲染后继承select的width属性
```
<select name="select_default_love" style="width: 85px">
    <option value="">请选择</option>
    <optgroup label="美食">
        <option value="红烧肉">红烧肉？</option>
        <option value="鸡蛋">鸡蛋？</option>
    </optgroup>
    <optgroup label="电视">
        <option value="笑傲江湖">笑傲江湖？</option>
        <option value="鹿鼎记" selected>鹿鼎记？</option>
        <option value="天龙八部">天龙八部？</option>
    </optgroup>
</select>
```
#### 事件绑定
```
$('select[name=select_default_love]').select('init'); //针对动态创建的select框初始化
$('select[name=select_default_love]').select('val','xxx'); //选中select值
$('select[name=select_default_love]').select('show'); //弹出菜单
$('select[name=select_default_love]').select('hide'); //隐藏菜单
$('select[name=select_default_love]').select('click'); //触发点击菜单事件，自动切换 show/hide状态
```

#### Button样式

```
<button type="button" class="d-btn">default</button>
<button type="button" class="d-btn d-btn-primary d-btn-lg">primary</button>
<button type="button" class="d-btn d-btn-success">success</button>
<button type="button" class="d-btn d-btn-warn d-btn-sm">warn</button>
<button type="button" class="d-btn d-btn-danger d-btn-xs">danger</button>
<button type="button" class="d-btn d-btn-danger" disabled>disabled</button>
```













