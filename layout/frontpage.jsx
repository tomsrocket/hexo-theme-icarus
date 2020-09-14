const { Component, Fragment } = require('inferno');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;

        return <Fragment>

            <div class="card">

                <article class={`smd card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">

                    {/* Title */}
                    <h1 class="title is-3 is-size-4-mobile">
                        {page.title}
                    </h1>
                    {/* Content/Excerpt */}

                    {page.content ? <div class="notification is-warning is-light">
                        <div class="content" dangerouslySetInnerHTML={{ __html: page.content }}></div>
                    </div> : null }


                </article>
            </div>
        </Fragment>;
    }
};
