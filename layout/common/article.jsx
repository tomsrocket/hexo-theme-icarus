const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');
const Related = require('./related');
const ArticleLicensing = require('hexo-component-inferno/lib/view/misc/article_licensing');

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
        const { url_for, date, date_xml, __, _p } = helper;

        const indexLaunguage = config.language || 'en';
        const language = page.lang || page.language || config.language || 'en';
        const cover = page.thumbnail ? url_for(page.thumbnail) : null;

        return <Fragment>
            {/* Main content */}
            <div class="card">

                {/* Thumbnail
                {cover ? <div class="card-image">
                    {index ? <a href={url_for(page.link || page.path)} class="image is-7by3">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </a> : <span class="image is-7by3">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </span>}
                </div> : null}
                */}
                {/* Metadata */}
                <article class={`smd card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                    {page.layout !== 'page' ? <div class="article-meta size-small is-uppercase level is-mobile">
                        <div class="level-left">
                            {/* Creation Date */}
                            {false && page.date && <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('article.created_at', `<time dateTime="${date_xml(page.date)}" title="${date_xml(page.date)}">${date(page.date)}</time>`)
                            }}></span>}
                            {/* Last Update Date */}
                            {false && page.updated && <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('article.updated_at', `<time dateTime="${date_xml(page.updated)}" title="${date_xml(page.updated)}">${date(page.updated)}</time>`)
                            }}></span>}
                            {/* author */}
                            {page.author ? <span class="level-item"> {page.author} </span> : null}
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
                            {/* Read time */}
                            {false && article && article.readtime && article.readtime === true ? <span class="level-item">
                                {(() => {
                                    const words = getWordCount(page._content);
                                    const time = moment.duration((words / 150.0) * 60, 'seconds');
                                    return `${_p('article.read_time', time.locale(index ? indexLaunguage : language).humanize())} (${_p('article.word_count', words)})`;
                                })()}
                            </span> : null}
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: _p('plugin.visit_count', '<span id="busuanzi_value_page_pv">0</span>')
                            }}></span> : null}
                        </div>
                    </div> : null}
                    {/* Title */}
                    <h1 class="title is-3 is-size-4-mobile">
                        {index ? <a class="link-muted" href={url_for(page.link || page.path)}>{page.title}</a> : page.title}
                    </h1>
                    {/* Content/Excerpt */}

                    {page.content ? <div class="notification is-warning is-light">
                        <div class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                    </div> : null }

                    <h2>Externer Link</h2>
                    <div class="notification is-primary is-light">
                        <i class="fas fa-external-link-alt"></i> <a href={page.external}>{page.external}</a>
                    </div>
                    {page.tags && page.tags.length ? <div>
                    <h2>Tags &amp; Schlagworte</h2>
                    <div class="notification is-link is-light">
                        {!index && page.tags && page.tags.length ? <div class="article--tags">
                            {page.tags.map(tag => {
                                return <a class="link-muted mr-2" rel="tag" href={url_for(tag.path)}><span class="tag is-link">{tag.name}</span></a>;
                            })}
                        </div> : null}
                    </div></div> : null }


                    {/* popular_posts( {}, page ) */}
                    <Related config={config} page={page} helper={helper} />

                    <h2>Webseiten-Informationen</h2>
                    <div class="notification is-info is-light">
                    <table class="table is-striped is-hoverable">
                        {/*<thead>
                            <tr>
                                <th class="is-warning" colspan="2">Spass/mit/Daten Crawler Status</th>
                            </tr>
                        </thead>*/}
                        <tbody>
                            <tr>
                                <th>Sprache der Webseite</th>
                                <td> {page.lang ? <img src={"/images/" + page.lang.toUpperCase() + ".svg"} class="flagg" /> : null}  {page.lang}</td>
                            </tr>
                            <tr>
                                <th>Region</th>
                                <td>{page.region}</td>
                            </tr>
                            <tr>
                                <th>Typ</th>
                                <td>{page.type}</td>
                            </tr>
                            <tr>
                                <th>Rang</th>
                                <td>{page.rank ? page.rank : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <h2>Crawler Status</h2>
                    <div class="notification is-info is-light">
                    <table class="table is-striped is-hoverable">
                        {/*<thead>
                            <tr>
                                <th class="is-warning" colspan="2">Spass/mit/Daten Crawler Status</th>
                            </tr>
                        </thead>*/}
                        <tbody>
                            <tr>
                                <th>Screenshot erstellt am</th>
                                <td>{new Date(page.screenshotDate).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                            <tr>
                                <th>Letzter Abruf</th>
                                <td>{new Date(page.lastCrawlDate).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                            <tr>
                                <th>Response-Größe</th>
                                <td>{page.responseSize} Bytes</td>
                            </tr>
                            <tr>
                                <th>HTTP-Status</th>
                                <td>{page.responseCode}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>


                    <h2>Webseiten-Screenshot</h2>
                    <div class="notification is-info is-light">
                        {/* Thumbnail */}
                        {cover ? <div class="imgg">
                            <span class="image">
                                <a href={page.external}><img src={cover} alt={page.title || cover} /></a>
                            </span>
                        </div> : null}
                    </div>

                    {/* Licensing block */}
                    {!index && article && article.licenses && Object.keys(article.licenses)
                        ? <ArticleLicensing.Cacheable page={page} config={config} helper={helper} /> : null}

                    {/* "Read more" button */}
                    {index && page.excerpt ? <a class="article-more button is-small size-small" href={`${url_for(page.link || page.path)}#more`}>{__('article.more')}</a> : null}
                    {/* Share button */}
                    {!(true || index) ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            </div>

            {/* Donate button
            {!index ? <Donates config={config} helper={helper} /> : null}
            */}
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
            {!(true || index) ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
