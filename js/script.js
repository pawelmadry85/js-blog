{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    articleTag: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
    articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML)
  };


  /*********************************** variables: ****************************************/
  const opt = {
    ArticleSelector: '.post',
    TitleSelector: '.post-title',
    TitleListSelector: '.titles',
    ArticleTagsSelector: '.post-tags .list',
    ArticleAuthorSelector: '.post-author',
    TagListSelector: '.tags',
    AuthorsListSelector: '.authors.list',
    CloudClassCount: 5,
    CloudClassPrefix: 'tag-size-',
  };

  /*********************************** titleClickHandler = function(event) ****************************************/
  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  /*********************************** generateTitleLinks(customSelektor = '') ****************************************/
  function generateTitleLinks(customSelector = ''){
  /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(opt.TitleListSelector);
    titleList.innerHTML = '';
    /* [DONE] for each article */
    const articles = document.querySelectorAll(opt.ArticleSelector + customSelector);
    let html = '';
    for(let article of articles) {
      /* [DONE] get the article id */
      const articleId = article.getAttribute('id');
      /* [DONE] find the title element  &  get the title from the title element */
      const articleTitle = article.querySelector(opt.TitleSelector).innerHTML;
      /* [DONE] create HTML of the link */
      // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);

      /* [DONE] insert link into titleList */
      html = html + linkHTML;
    }
    titleList.innerHTML = html;
    /** ZMIANA, PRZENIESIENIE Z PIERWSZEJ CZĘŚCI ZADANIA KODU ODPOWIEDZIALNEGO ZA POWIĄZANIE KLIKNIĘCIA W LINKI Z FUNKCJĄ titleClickHandler **/
    const links = document.querySelectorAll('.titles a');
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }
  generateTitleLinks();

  /*********************************** calculateTagsParams(tags) ****************************************/
  function calculateTagsParams(tags) {
    const params = {
      max: 0,
      min: 999999
    };

    for(let tag in tags) {
      if(tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if(tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }

  /*********************************** calculateTagClass ****************************************/
  function calculateTagClass (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opt.CloudClassCount - 1) + 1);

    return opt.CloudClassPrefix + classNumber;
  }

  /*********************************** generateTags() ****************************************/
  function generateTags(){
    /* [NEW] create a new variable allTags with an empty array */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(opt.ArticleSelector);
    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opt.ArticleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray) {
        /* generate HTML of the link */
        // const linkTagHTML = '<li><a href="#tag-'+ tag +'">' + tag + '</a></li> ';

        const linkHTMLData = {tag: tag};
        const linkTagHTML = templates.articleTag(linkHTMLData);


        /* add generated code to html variable */
        html = html + linkTagHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opt.TagListSelector);
    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);

    let allTagsHTML = '';
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      const tagLinkHTML ='<li><a href="#tag-'+ tag +'"' + ' class="' + calculateTagClass(allTags[tag], tagsParams) + '"' + '>' + tag + '</a></li> ';
      allTagsHTML += tagLinkHTML;
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  }
  generateTags();

  /*********************************** tagClickHandler(event) ****************************************/
  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-','');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
    /* remove class active */
      activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const sameTagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let sameTagLink of sameTagLinks) {
    /* add class active */
      sameTagLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  /*********************************** addClickListenersToTags() ****************************************/
  function addClickListenersToTags(){
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('[href^="#tag-"]');
    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  }
  addClickListenersToTags();

  /*********************************** generateAuthor ****************************************/
  function generateAuthor(){
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(opt.ArticleSelector);
    /* START LOOP: for every article: */
    const authorList = document.querySelector(opt.AuthorsListSelector);
    for(let article of articles) {
      /* find author wrapper */
      const authorWrapper = article.querySelector(opt.ArticleAuthorSelector);
      /* make html variable with empty string */
      let html = '';
      /* get authors from data-author attribute */
      const articleAuthor = article.getAttribute('data-author');
      /* generate HTML of the link */
      if(!allAuthors[articleAuthor]) {
      /* [NEW] add tag to allTags object */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
      // const linkAuthorHTML = '<a href="#author-'+ articleAuthor +'">' + articleAuthor + '</a> ';

      const linkHTMLData = {articleAuthor: articleAuthor};
      const linkAuthorHTML = templates.articleAuthor(linkHTMLData);


      /* add generated code to html variable */
      html = html + linkAuthorHTML;
      /* insert HTML of all the links into the authors wrapper */
      authorWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    let allAuthorsHTML = '';
    for(let author in allAuthors){
      const authorLinkHTML ='<li><a href="#author-'+ author +'"' + ' class="author-name"' + '>' + author + '</a></li> ';
      allAuthorsHTML += authorLinkHTML;
    }
    authorList.innerHTML = allAuthorsHTML;
  }
  generateAuthor();

  /*********************************** authorClickHandler(event) ****************************************/
  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-','');
    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active author link */
    for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
      activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active author link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const sameAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found author link */
    for (let sameAuthorLink of sameAuthorLinks) {
    /* add class active */
      sameAuthorLink.classList.add('active');
    /* END LOOP: for each found author link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  /*********************************** addClickListenerToAuthor ****************************************/
  function addClickListenersToAuthor(){
    /* find all links to authors */
    const authorLinks = document.querySelectorAll('[href^="#author-"]');
    /* START LOOP: for each link */
    for (let authorLink of authorLinks) {
    /* add authorClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  }
  addClickListenersToAuthor();
}
