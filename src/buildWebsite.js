// The JS Component of Maxtremaine.com

// Utilities. Thank you Eric Elliot.

const pipe = (...fns) => x => fns.reduce((g, f) => f(g), x);

const findDBSectionArr = location => db => {
    const foundObject = db.maxtremaine.data[location];
    return Object.values(foundObject);
};

const workAndPass = (fn) => (...params) => db => {
    fn(...params)(db);
    return Promise.resolve(db);
};

const filterArr = filterBy => arr => (
    filterBy === ''?
    arr:
    arr.filter(v => v[filterBy])
);

const mapAndJoin = fn => arr => arr.map(fn).join('');

// Assembling data and generating HTML.

const generateArticleHTML = ({link, title, description}) => (
    `<p><a href="${link}">${title}</a>: ${description}</p>`
);

const generateQuoteHTML = ({quote, author}) => (
    `<p><q>${quote}</q><br/>- ${author}</p>`
);

const addInnerHTML = parentId => html => (
    document
        .getElementById(parentId)
        .innerHTML = html
);

const buildSection = ({location, generator, destination, filter = ''}) => pipe(
    findDBSectionArr(location),
    filterArr(filter),
    mapAndJoin(generator),
    addInnerHTML(destination)
);

const buildArticles = workAndPass(buildSection)({
    location: 'articles',
    generator: generateArticleHTML,
    destination: 'articleListContainer'
});

const buildQuotes = workAndPass(buildSection)({
    location: 'favouriteQuotes',
    generator: generateQuoteHTML,
    destination: 'quoteListContainer',
    filter: 'public'
});

// Fetching data and building the website.

const getWebsiteData = fetch('src/websiteData.json');

const parseJSON = rawData => rawData.json();

const showHiddenNodes = () => {
    const hiddenNodes = document.getElementsByClassName('hiddenWithoutJS');
    const hiddenNodesArr = Array.from(hiddenNodes);
    hiddenNodesArr.forEach(node => node.style.display = 'block');
};

getWebsiteData
    .then(parseJSON)
    .then(buildArticles)
    .then(buildQuotes)
    .then(showHiddenNodes);