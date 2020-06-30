const logger = require('hexo-log')();
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { url_for } = helper; 

        // console.log("page", page);
        // console.log("categories", page.categories);

        let popular = {};
        if (page.tags && page.tags.length > 0) {
            page.tags.each((tag) => {
                tag.posts.each((post) => {
                    if (post.slug != page.slug) {
                        if (popular[post.slug] === undefined) {
                            popular[post.slug] = {
                                title: post.title, 
                                link: post.link,
                                path: post.path,
                                rank: 1,
                                teaser: ("" + post._content).substring(0,70)
                            };
                        } else {
                            popular[post.slug]['rank']++;
                        }
                    }
                });
            });
        }


        if (Object.keys(popular).length === 0) {
            return null;
        }

        let popularPosts = Object.values(popular);
        popularPosts = popularPosts.sort((a, b) => (a.rank > b.rank) ? 1 : -1);
        popularPosts = popularPosts.reverse().slice(0, 3);

        // console.log("POPO", popularPosts);

        try {
            return  <>
                        <h2>Verwandte Links</h2>
                        <div class="notification is-info is-light"><ul>
                            {popularPosts.map(page => {
                                return  <li class="teaserlink"><a href={url_for(page.link || page.path)}>
                                            {page.title}</a> 
                                            <span class="has-text-grey-light">
                                                {(page.teaser.length > 5) ? (" - " + page.teaser + "..") : ""} 
                                            </span>
                                        </li>
                                ;
                            })}
                        </ul></div>
                    </>;
        } catch (e) {
            logger.w(`Error occurred`, e);
            return null;
        }
    }
};
