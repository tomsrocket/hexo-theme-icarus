const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');

/**
 * Get the word count of text.
 */
function getWordCount(content) {
    if (typeof content === 'undefined') {
        return 0;
    }
    content = content.replace(/<\/?[a-z][^>]*>/gi, '');
    content = content.trim();
    return content ? (content.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins } = config;
        const { has_thumbnail, url_for, date, date_xml, __, _p } = helper;

        const indexLaunguage = config.language || 'en';
        const language = page.lang || page.language || config.language || 'en';
        const cover = page.thumbnail ? url_for(page.thumbnail) : null;

        return <Fragment>
            {/* Main content */}
            <div class="card is-horizontal columns">
                <div class="card-image column is-one-fifth">
                    <figure class="image is-4by3">
                        <a href={url_for(page.link || page.path)}>
                            <img class="thumbnail" src={cover} alt={page.title || cover} />             
                        </a>
                    </figure>
                </div>
                <article class="card-content column is-four-fifths">
                    {/* Title */}
                    <h1 class="title is-3 is-size-4-mobile"> 
                        {index ? <a class="link-muted" href={url_for(page.link || page.path)}>{page.title}</a> : page.title}
                    </h1>
                    {/* Content/Excerpt */}
                    <div class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>

                    {/* Tags */}
                    {!index && page.tags && page.tags.length ? <div class="article-tags size-small is-uppercase mb-4">
                        <span class="mr-2">#</span>
                        {page.tags.map(tag => {
                            return <a class="link-muted mr-2" rel="tag" href={url_for(tag.path)}>{tag.name}</a>;
                        })}
                    </div> : null}

                    {page.layout !== 'page' ? <div class="article-meta size-small is-uppercase level is-mobile">
                        <div class="level-left">
                            {/* Date 
                            <time class="level-item" dateTime={date_xml(page.date)} title={date_xml(page.date)}>{date(page.date)}</time>*/}
                            {/* Categories */}
                            {page.categories && page.categories.length ? <span class="level-item">
                                {(() => {
                                    const categories = [];
                                    page.categories.forEach((category, i) => {
                                        categories.push(<a class="link-muted" href={url_for(category.path)}>{category.name}</a>);
                                        if (i < page.categories.length - 1) {
                                            categories.push(<span>&nbsp;/&nbsp;</span>);
                                        }
                                    });
                                    return categories;
                                })()}
                            </span> : null}
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: '<i class="far fa-eye"></i>' + _p('plugin.visit', '&nbsp;&nbsp;<span id="busuanzi_value_page_pv">0</span>')
                            }}></span> : null}
                        </div>
                    </div> : null}


                    {/* "Read more" button */}
                    {index && page.excerpt ? <a class="article-more button is-small size-small" href={`${url_for(page.path)}#more`}>{__('article.more')}</a> : null}
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                    {/*
                    <div class="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                        <span class="tag is-link">blackbird was a sailor</span>
                        <span class="tag is-info">that's what you do</span>

                        <br /><br />

                        <div class="field is-grouped is-grouped-multiline">
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">npm</span>
                                    <span class="tag is-info">0.5.0</span>
                                </div>
                            </div>

                            <div class="field is-grouped is-grouped-multiline">
                                <div class="control">
                                    <div class="tags has-addons">
                                    <span class="tag is-link">axiomaciae</span>
                                    <span class="tag is-info">24. 07. 2020</span>
                                    </div>
                                </div>
                                <br />
                                <time datetime="2018-5-8">15:51 PM - 28 May 2018</time>

                            </div>
                        </div>
                    </div>
                    */}


                </article>
            </div>


            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}
            {/* Post navigation */}
            {!index && (page.prev || page.next) ? <nav class="post-navigation mt-4 level is-mobile">
                {page.prev ? <div class="level-start">
                    <a class={`article-nav-prev level level-item${!page.prev ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.prev.path)}>
                        <i class="level-item fas fa-chevron-left"></i>
                        <span class="level-item">{page.prev.title}</span>
                    </a>
                </div> : null}
                {page.next ? <div class="level-end">
                    <a class={`article-nav-next level level-item${!page.next ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.next.path)}>
                        <span class="level-item">{page.next.title}</span>
                        <i class="level-item fas fa-chevron-right"></i>
                    </a>
                </div> : null}
            </nav> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
