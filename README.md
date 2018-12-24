# SPLoader
A JQuery plug-in for creating UI components in SharePoint pages without using any server-side or JavaScript code.

# How to use?
1- Add references for JQuery and SPLoader.js
'''
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="spLoader.js"></script>
'''

2- Create your HTML Component
  <div adp-element="" adp-web-url="/" adp-list-title="Pages" adp-item-count="5" adp-order-field="ArticleStartDate" adp-order="desc">
    <div adp-repeat>
      <a adp-field="FileRef" adp-attr="href">
        <img adp-field="PublishingRollupImage" adp-attr="src">
        <p adp-text="Title"></p>
        <p adp-text="ArticleStartDate"></p>
      </a>
    </div>
  </div>

3- Add the html to your page; maybe through Content Editor Webpart!

Thats is! good luck..
