const pipe = (...fns) => x => fns.reduce((g, f) => f(g), x)

const findDBSectionArr = location => db => {
    const foundObject = db.maxtremaine.data[location];
    return Object.values(foundObject);
};

const generateArticleHTML = ({link, title, description}) => {
    return `<p><a href="${link}">${title}</a>: ${description}</p>`;
};

const generateQuoteHTML = ({quote, author}) => {
    return `<p><q>${quote}</q><br/>- ${author}</p>`;
};

const addInnerHTML = parentId => html => {
    const parent = document.getElementById(parentId);
    parent.innerHTML = html;
};

const filterArr = filterBy => sectionArr => (
    filterBy === ''?
    sectionArr:
    sectionArr.filter(v => v[filterBy])
);

const generateHTML = generator => sectionArr => (
    sectionArr
        .map(generator)
        .join('')
);

const buildSection = (location, generator, destination, filter = '') => pipe(
    findDBSectionArr(location),
    filterArr(filter),
    generateHTML(generator),
    addInnerHTML(destination)
)

const buildArticles = buildSection('articles', generateArticleHTML, 'articleListContainer');
const buildQuotes = buildSection('favouriteQuotes', generateQuoteHTML, 'quoteListContainer', 'public');

const parseJSON = rawData => rawData.json();

const buildSections = db => {
    buildArticles(db);
    buildQuotes(db);
    return db;
};

const showHiddenNodes = db => {
    const hiddenNodes = document.getElementsByClassName("hiddenWithoutJS");
    const arrayNodesArr = Array.from(hiddenNodes);
    arrayNodesArr.forEach(node => node.style.display = "block");
    return db;
}

const getWebsiteData = fetch('src/websiteData.json');

getWebsiteData
    .then(parseJSON)
    .then(buildSections)
    .then(showHiddenNodes);