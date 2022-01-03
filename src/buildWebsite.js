// The JS Component of Maxtremaine.com

// Utilities. Thank you Eric Elliot.

const pipe = (...fns) => x => fns.reduce((g, f) => f(g), x);

const findDBSectionArr = location => db => {
    const foundObject = db.maxtremaine.data[location];
    return Object.values(foundObject);
};

const filterObjs = filterBy => arr => (
    filterBy === ''?
    arr:
    arr.filter(v => v[filterBy])
);

const sortObjs = sortBy => arr => (
    sortBy === ''?
    arr:
    arr.sort((a, b) => a[sortBy] - b[sortBy])
);

const mapAndJoin = fn => arr => arr.map(fn).join('');

// Assembling data and generating HTML.

const generateContact = ({title, link}) => (
    `<li><a href="${link}" target="_blank">${title}</a></li>`
);

const generateArticleHTML = ({link, title, date, description}) => (
    `<li><a href="${link}" target="_blank">${title}</a> (${date}): ${description}</li>`
);

const buildSection = ({location, generator, filter = '', sort = ''}) => pipe(
    findDBSectionArr(location),
    filterObjs(filter),
    sortObjs(sort),
    mapAndJoin(generator),
    addInnerHTML(location)
);

// Generators

const addInnerHTML = parentId => html => (
    document
        .getElementById(parentId)
        .innerHTML = html
);

const buildContact = buildSection({
    location: 'contact',
    generator: generateContact
})

const buildArticles = buildSection({
    location: 'articles',
    generator: generateArticleHTML,
    sort: 'order'
});

// Fetching data and building the website.

const getWebsiteData = fetch('./src/websiteData.json');

const parseJSON = rawData => rawData.json();

const showHiddenNodes = () => {
    const hiddenNodes = document.getElementsByClassName('hiddenWithoutJS');
    const hiddenNodesArr = Array.from(hiddenNodes);
    hiddenNodesArr.forEach(node => node.style.display = 'block');
};

const hideJsWarning = () => {
    document.getElementById('jsWarning').style.display = 'none';
};

// Actions

getWebsiteData
    .then(parseJSON)
    .then(data => {
        buildArticles(data);
        buildContact(data);
    })
    .then(showHiddenNodes)
    .then(hideJsWarning);