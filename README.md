# SPLoader
A JQuery plug-in for creating UI components in SharePoint pages without using any server-side or JavaScript code.

## How to use?
1- Add references for JQuery and SPLoader.js
```
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="spLoader.js"></script>
```

2- Create your HTML Component
```
<div adp-element="" adp-web-url="/" adp-list-title="Pages" adp-item-count="5" adp-order-field="ArticleStartDate" adp-order="desc">
  <div adp-repeat>
    <a adp-field="FileRef" adp-attr="href">
      <img adp-field="PublishingRollupImage" adp-attr="src">
      <p adp-text="Title"></p>
      <p adp-text="ArticleStartDate"></p>
    </a>
  </div>
</div>
```

3- Add the html to your page; maybe through Content Editor Webpart!

Thats is! good luck..

## spLoader html properties:
```
sp-element = no value needed > used on the root element of the component to be loaded on page load
sp-list-title = "list or library title"
sp-web-url = "server relative web url"
sp-filter-field = "Boolean field internal name" > used if you want to filter items by a yes/no field like: IsActive
sp-item-count = "10" > query limit
sp-onload = callback to call after the component is loaded
sp-repeat = no value needed > used on the element that should be repeated for each item in the results
sp-text = "field internal name to map to inner html of the element"
sp-field = "field internal name to map to sp-attr value"
sp-attr = "html element attributes name to fill with the sp-field value"
sp-order = "desc" | "asc"
sp-order-field = "Field Internal Name"
```
