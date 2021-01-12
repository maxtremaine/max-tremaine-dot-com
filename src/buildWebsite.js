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

const addInnerHTML = (parentId, string) => {
    const parent = document.getElementById(parentId);
    parent.innerHTML = string;
};

const buildSection = (location, generator, destination, filter = '') => db => {
    const sectionArr = findDBSectionArr(location)(db);
    const filteredArr = filter !== ''?
        sectionArr.filter(v => v[filter]):
        sectionArr;
    const html = filteredArr
        .map(generator)
        .join('');
    addInnerHTML(destination, html);
    return db;
};

const parseJSON = rawData => rawData.json();

const showHiddenNodes = db => {
    const hiddenNodes = document.getElementsByClassName("hiddenWithoutJS");
    const arrayNodesArr = Array.from(hiddenNodes);
    arrayNodesArr.forEach(node => node.style.display = "block");
    return db;
}

const getWebsiteData = fetch('src/websiteData.json');
getWebsiteData
    .then(parseJSON)
    .then(buildSection('articles', generateArticleHTML, 'articleListContainer'))
    .then(buildSection('favouriteQuotes', generateQuoteHTML, 'quoteListContainer', 'public'))
    .then(showHiddenNodes);

