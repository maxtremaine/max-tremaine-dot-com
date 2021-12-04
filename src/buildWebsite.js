// The JS Component of Maxtremaine.com

// Utilities. Thank you Eric Elliot.

const pipe = (...fns) => x => fns.reduce((g, f) => f(g), x);

const findDBSectionArr = location => db => {
    const foundObject = db.maxtremaine.data[location];
    return Object.values(foundObject);
};

const filterArr = filterBy => arr => (
    filterBy === ''?
    arr:
    arr.filter(v => v[filterBy])
);

const mapAndJoin = fn => arr => arr.map(fn).join('');

// Assembling data and generating HTML.

const generateContact = ({title, link}) => (
    `<a href="${link}" target="_blank">${title}</a></br>`
);

const generateArticleHTML = ({link, title, description}) => (
    `<li><a href="${link}" target="_blank">${title}</a>: ${description}</li>`
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

const buildContact = buildSection({
    location: 'contact',
    generator: generateContact,
    destination: 'contact'
})

const buildArticles = buildSection({
    location: 'articles',
    generator: generateArticleHTML,
    destination: 'articles'
});

// Fetching data and building the website.

const getWebsiteData = fetch('/src/websiteData.json');

const parseJSON = rawData => rawData.json();

const showHiddenNodes = () => {
    const hiddenNodes = document.getElementsByClassName('hiddenWithoutJS');
    const hiddenNodesArr = Array.from(hiddenNodes);
    hiddenNodesArr.forEach(node => node.style.display = 'block');
};

const hideJsWarning = () => {
    document.getElementById('jsWarning').style.display = 'none';
};

getWebsiteData
    .then(parseJSON)
    .then(data => {
        buildArticles(data);
        buildContact(data);
    })
    .then(hideJsWarning)
    .then(showHiddenNodes);